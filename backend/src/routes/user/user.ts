import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const signInResponse = Type.Object(
    {
        id: Type.Number(),
        login: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
        middleName: Type.String(),
    },
    { description: "Успешная авторизация" }
);

export const get = async (fastify: FastifyInstance) => {
    fastify.get(
        "/user/info",
        {
            preHandler: fastify.auth(),
            schema: {
                description: "Получение информации о текущем пользователе",
                tags: ["user"],
                response: {
                    "2xx": signInResponse,
                },
            },
        },
        async (req, res) => {
            console.log(req.body);

            if (!req.user)
                return res.status(401).send({
                    code: "USER_NOT_EXISTS",
                    message: "Неверный логин или пароль",
                });

            return res.send(req.user);
        }
    );
};
