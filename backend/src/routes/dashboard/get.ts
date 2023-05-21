import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import QueryParser from "sequelize-query";
import sequelize from "../../db/sequelize";
import { Dashboard } from "../../db";
import { Op } from "sequelize";

const { parse } = QueryParser(sequelize);

const getRequest = Type.Object(
    {
        dashboardId: Type.Number(),
    },
    { description: "id дашборада", additionalProperties: true }
);

export const get = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: Static<typeof getRequest> }>(
        "/dashboard/:dashboardId(^\\d+)",
        {
            preHandler: fastify.auth(),
            schema: {
                description: "Получение дашбоарда (с фильтрами и сортировкой)",
                params: getRequest,
                tags: ["dashboard"],
                response: {
                    400: Type.Object(
                        {
                            code: Type.String({
                                default: "DASHBOARD_NOT_FOUND",
                            }),
                            message: Type.String({
                                default: "Дашбоард не найден",
                            }),
                        },
                        { description: "Дашбоард не найден" }
                    ),
                },
            },
        },
        async (req, res) => {
            const { dashboardId } = req.params;
            console.log((await parse(req)).where);
            const dashboard = await Dashboard.findOne({
                where: {
                    id: dashboardId,
                    data: { [Op.contains]: [(await parse(req)).where] },
                },
            });
            if (!dashboard)
                return res.status(400).send({
                    code: "DASHBOARD_NOT_FOUND",
                    message: "Дашбоард не найден",
                });

            return res.send(dashboard);
        }
    );
};
