import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { User } from "../../db";

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const listRequest = Type.Object(
    {
        userId: Type.Number(),
    },
    { description: "id участника" }
);

const listResponse = Type.Object({
    login: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    middleName: Type.String(),
});

export const get = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: Static<typeof listRequest> }>(
        "/user/:userId",
        {
            schema: {
                description: "Получение информации о участнике",
                tags: ["user"],
                params: listRequest,
                response: {
                    "2xx": listResponse,
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
                                default: "USER_NOT_FOUND",
                            }),
                            message: Type.String({
                                default: "Эксперт не найден",
                            }),
                        },
                        { description: "Эксперт не найден" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { userId } = req.params;

            const user = await User.findByPk(userId);
            if (!user)
                return res.status(400).send({
                    code: "USER_NOT_FOUND",
                    message: "Эксперт не найден",
                });

            return res.send(user);
        }
    );
};
