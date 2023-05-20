import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { User } from "../../db";
import sequelize from "../../db/sequelize";
import QueryParser from "sequelize-query";

const { parse } = QueryParser(sequelize);
//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const listRequest = Type.Object(
    {
        page: Type.Number(),
        pageSize: Type.Number(),
    },
    { description: "Фильтры, сортировка, страницы" }
);

const listResponse = Type.Object({
    pagesCount: Type.Number(),
    items: Type.Array(Type.Any()),
});

export const get = async (fastify: FastifyInstance) => {
    fastify.get<{ Querystring: Static<typeof listRequest> }>(
        "/user/list",
        {
            schema: {
                description:
                    "Получение списка экспертов (с фильтрами и сортировкой)",
                tags: ["user"],
                querystring: listRequest,
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
                },
            },
        },
        async (req, res) => {
            const { page, pageSize } = req.query;

            const { rows, count } = await User.findAndCountAll({
                ...(await parse(req)),
                limit: +pageSize,
                offset: (+page - 1) * +pageSize,
                attributes: [
                    "id",
                    "login",
                    "firstName",
                    "lastName",
                    "middleName",
                ],
            });

            return res.send({
                pagesCount: Math.floor(count / +pageSize) + 1,
                items: rows,
            });
        }
    );
};
