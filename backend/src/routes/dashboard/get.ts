import { FastifyInstance } from "fastify";

export const get = async (fastify: FastifyInstance) => {
    fastify.get(
        "/dashboard",
        {
            preHandler: fastify.auth(),
            schema: {
                description: "Получение дашбоарда",
                tags: ["dashboard"],
            },
        },
        async (req, res) => {
            return res.send("not implemented");
        }
    );
};
