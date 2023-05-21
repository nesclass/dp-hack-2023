import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import sequelize from "../../db/sequelize";
import QueryParser from "sequelize-query";
import { Dashboard } from "../../db";

const { parse } = QueryParser(sequelize);

//Подробнее о возможностях валидации лучше смотреть тут - https://github.com/sinclairzx81/typebox
const listRequest = Type.Object(
    {
        page: Type.Number(),
        pageSize: Type.Number(),
    },
    { description: "Данные для авторизации", additionalProperties: true }
);

const listResponse = Type.Object({
    pagesCount: Type.Number(),
    items: Type.Array(Type.Any({ default: {} })),
});

export const list = async (fastify: FastifyInstance) => {
    fastify.get<{ Querystring: Static<typeof listRequest> }>(
        "/dashboard/list",
        {
            schema: {
                description:
                    "Получение списка дашбоардов (с фильтрами и сортировкой)",
                tags: ["dashboard"],
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

            const { rows, count } = await Dashboard.findAndCountAll({
                ...(await parse(req)),
                limit: +pageSize,
                offset: (+page - 1) * +pageSize,
                attributes: ["id", "name"],
            });

            return res.send({
                pagesCount: Math.floor(count / +pageSize) + 1,
                items: rows,
            });
        }
    );
};
