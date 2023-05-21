import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { Participant } from "../../db";

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const getRequest = Type.Object(
    {
        participantId: Type.Number(),
    },
    { description: "id участника" }
);

export const get = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: Static<typeof getRequest> }>(
        "/participant/:participantId",
        {
            schema: {
                description: "Получение информации о участнике",
                tags: ["participant"],
                params: getRequest,
                response: {
                    401: Type.Object(
                        {
                            code: Type.String({ default: "USER_NOT_EXISTS" }),
                            message: Type.String({
                                default: "Неверный логин или пароль",
                            }),
                        },
                        { description: "Логин или пароль не подходят" }
                    ),
                    400: Type.Object(
                        {
                            code: Type.String({
                                default: "PARTICIPANT_NOT_FOUND",
                            }),
                            message: Type.String({
                                default: "Участник не найден",
                            }),
                        },
                        { description: "Участник не найден" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { participantId } = req.params;

            const participant = await Participant.findByPk(participantId);
            if (!participant)
                return res.status(400).send({
                    code: "PARTICIPANT_NOT_FOUND",
                    message: "Участник не найден",
                });

            return res.send(participant);
        }
    );
};
