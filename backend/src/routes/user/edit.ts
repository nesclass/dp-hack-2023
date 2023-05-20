import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const signInRequest = Type.Object(
    {
        firstName: Type.String(),
        lastName: Type.String(),
        middleName: Type.String(),
        password: Type.String(),
    },
    { description: "Данные для изменения" }
);

const signInResponse = Type.Object(
    {
        id: Type.Number(),
        login: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
        middleName: Type.String(),
    },
    { description: "Успешное изменение данных" }
);

export const edit = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: Static<typeof signInRequest> }>(
        "/user/edit",
        {
            preHandler: fastify.auth(),
            schema: {
                description: "Изменение информации текущего пользователя",
                tags: ["user"],
                body: signInRequest,
                response: {
                    "2xx": signInResponse,
                },
            },
        },
        async (req, res) => {
            const { firstName, lastName, middleName, password } = req.body;

            const user = await req.user.update({
                firstName,
                lastName,
                middleName,
                password,
            });

            return res.send(user);
        }
    );
};
