import { FastifyInstance } from "fastify";
import fastifyMulter from "fastify-multer";
import csv from "csvtojson";
import { Type } from "@sinclair/typebox";
import XLSX from "xlsx";
import { createHash } from "crypto";
import { Participant, Process, Dashboard } from "../../../db";

const allowedFileTypes = ["csv", "xlsx"];
const alowedTypes = ["participant", "result"];

const uploader = fastifyMulter({
    fileFilter: function (req, file, cb) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, type] = file.originalname.split(".");
        if (!allowedFileTypes.includes(type))
            cb(new Error(`Тип файла ${type} не поддерживается.`));
        if (file.size > 10_240)
            cb(new Error("Файл должен весить меньше чем 10mb."));
        cb(null, true);
    },
});

const uploadResponse = Type.Object(
    {
        processId: Type.Number({ description: "aa" }),
        message: Type.String({ default: "Загрузка данных..." }),
    },
    { description: "Задача отдана микросервису" }
);

export const upload = async (fastify: FastifyInstance) => {
    fastify.redis.sub.subscribe("dataset/output");
    fastify.redis.sub.on("message", async (channel, message) => {
        const response = JSON.parse(message);
        const process = await Process.findOne({
            where: {
                id: response.id,
            },
        });
        if (response.type === "participants") {
            const participants = await Participant.bulkCreate(
                response.data.map((participant: Participant) => ({
                    ...participant,
                    fio: participant.middleName
                        ? `${participant.lastName} ${participant.firstName} ${participant.middleName}`
                        : `${participant.lastName} ${participant.firstName}`,
                }))
            );
            console.log("count", participants.length);
        } else {
            await Dashboard.create({
                name: process.fileName,
                data: response.data,
            });
        }
        await process.update(
            response.error
                ? { status: "REJECTED", message: response.error }
                : { status: "RESOLVED" },
            { where: { id: response.id } }
        );
    });

    fastify.post(
        "/dashboard/upload",
        {
            preHandler: [fastify.auth(), uploader.single("dataset")],
            schema: {
                description: "Загрузка .csv файла",
                tags: ["dashboard"],
                consumes: ["multipart/form-data"],
                response: {
                    "2xx": uploadResponse,
                    400: Type.Object(
                        {
                            code: Type.String({ default: "RECEIVER_ERROR" }),
                            message: Type.String({
                                default:
                                    "Произошла ошибка. Попробуйте позднее.",
                            }),
                        },
                        { description: "Ошибка если микросервис упал" }
                    ),
                    409: Type.Object(
                        {
                            code: Type.String({
                                default: "FILE_ALREADY_PROCESSED",
                            }),
                            message: Type.String({
                                default: "Этот файл уже был загружен",
                            }),
                        },
                        { description: "Берётся хеш от названия+размера" }
                    ),
                    408: Type.Object(
                        {
                            code: Type.String({
                                default: "TYPE_NOT_VALID",
                            }),
                            message: Type.String({
                                default:
                                    "Доступные типы датасетов - " +
                                    alowedTypes.join(", "),
                            }),
                        },
                        { description: "Неверно указан тип датасета" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { type } = req.body as { type: string };

            if (!alowedTypes.includes(type))
                return res.status(408).send({
                    code: "TYPE_NOT_VALID",
                    message:
                        "Доступные типы датасетов - " + alowedTypes.join(", "),
                });
            const fileHash = createHash("md5")
                .update(req.file.originalname + req.file.size)
                .digest("hex");

            const fileProcess = await Process.findOne({
                where: {
                    fileHash,
                },
            });
            if (fileProcess)
                return res.status(409).send({
                    code: "FILE_ALREADY_PROCESSED",
                    message: "Этот файл уже был загружен",
                });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [fileName, fileType] = req.file.originalname.split(".");
            const process = await Process.create({
                fileName,
                fileHash,
                userId: req.user.id,
            });

            if (fileType === "xlsx") {
                const workbook = XLSX.read(req.file.buffer);
                const sheet_name_list = workbook.SheetNames;
                const data = XLSX.utils.sheet_to_json(
                    workbook.Sheets[sheet_name_list[0]]
                );

                const result = await fastify.redis.pub.publish(
                    "dataset/input",
                    JSON.stringify({ data, type, id: process.id })
                );

                if (!result) {
                    await process.destroy();
                    return res.status(400).send({
                        code: "RECEIVER_ERROR",
                        message: "Произошла ошибка. Попробуйте позднее.",
                    });
                }
            } else {
                const data = await csv({
                    checkType: true,
                    ignoreEmpty: true,
                }).fromString(req.file.buffer.toString());

                const result = await fastify.redis.pub.publish(
                    "dataset/input",
                    JSON.stringify({ data, type, id: process.id })
                );
                if (!result) {
                    await process.destroy();
                    return res.status(400).send({
                        code: "RECEIVER_ERROR",
                        message: "Произошла ошибка. Попробуйте позднее.",
                    });
                }
            }

            return res.send({
                message: "Загрузка данных...",
                processId: process.id,
            });
        }
    );
};
