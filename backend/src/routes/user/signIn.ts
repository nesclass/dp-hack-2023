import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { User } from "../../db";

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const signInRequest = Type.Object(
    {
        login: Type.String({ default: "admin" }),
        password: Type.String({
            minLength: 3,
            maxLength: 512,
            default: "admin",
        }),
    },
    { description: "Данные для авторизации" }
);

const signInResponse = Type.String({ description: "Успешная авторизация" });

export const signIn = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: Static<typeof signInRequest> }>(
        "/user/signIn",
        {
            schema: {
                description: "Авторизация пользователя",
                tags: ["user"],
                body: signInRequest,
                response: {
                    "2xx": signInResponse,
                    401: Type.Object(
                        {
                            code: Type.String({ default: "USER_NOT_EXISTS" }),
                            message: Type.String({
                                default: "Неверный логин или пароль",
                            }),
                        },
                        { description: "Логин или пароль не подходят" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { login, password } = req.body;
            console.log(req.body);
            const user = await User.findOne({
                where: {
                    login,
                    password,
                },
            });

            if (!user)
                return res.status(401).send({
                    code: "USER_NOT_EXISTS",
                    message: "Неверный логин или пароль",
                });

            const token = fastify.jwt.sign({ id: user.id });
            return res.send(token);
        }
    );
};
