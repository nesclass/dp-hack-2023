import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { Process } from "../../../db";

const statusRequest = Type.Object(
    {
        processId: Type.Number({ default: 1 }),
    },
    { description: "Получение статуса процесса обработки" }
);

const statusResponse = Type.Object(
    {
        status: Type.String(),
        message: Type.Optional(Type.String()),
    },
    { description: "Статус процесса обработки. message в случае ошибки" }
);

export const status = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: Static<typeof statusRequest> }>(
        "/dashboard/upload/status/:processId",
        {
            preHandler: fastify.auth(),
            schema: {
                description:
                    "Получение статуса процесса обработки по processId",
                tags: ["dashboard"],
                params: statusRequest,
                response: {
                    "2xx": statusResponse,
                    400: Type.Object(
                        {
                            code: Type.String({ default: "PROCESS_NOT_FOUND" }),
                            message: Type.String({
                                default: "Такого процесса не существует",
                            }),
                        },
                        { description: "Если процесса по processId не найдено" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { processId } = req.params;

            const process = await Process.findOne({
                where: {
                    id: processId,
                },
            });
            if (!process)
                return res.status(409).send({
                    code: "PROCESS_NOT_FOUND",
                    message: "Такого процесса не существует",
                });

            return res.send({
                status: process.status,
                message: process.message ?? undefined,
            });
        }
    );
};
