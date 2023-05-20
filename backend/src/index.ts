import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import fastifyRedis from "@fastify/redis";
import fastifyMulter from "fastify-multer";
import { glob } from "glob";
import { User } from "./db";
import { config } from "./config";

const fastify = Fastify({
    logger: {
        level: "warn",
    },
});

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: number;
        };
    }
}
declare module "fastify" {
    interface FastifyInstance {
        auth: () => (req: FastifyRequest, res: FastifyReply) => void;
    }
    interface FastifyRequest {
        file: any;
        user: User;
    }
}

fastify.register(fastifySwagger, {
    swagger: {
        host: config.host,
        securityDefinitions: {
            bearerAuth: {
                name: "Authorization",
                in: "header",
                type: "apiKey",
                description: "JWT Authorization header (don't forget Bearer)",
            },
        },
        security: [
            {
                bearerAuth: [
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg0NTEzNzkwfQ.Js-xvOAsKqqDXhxQP7M8RourpZHyEIFkxZIbkFuuffc",
                ],
            },
        ],
    },
});

fastify.register(fastifySwaggerUI, {
    routePrefix: "/documentation",
    uiConfig: {
        docExpansion: "full",
        deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
});
fastify.register(fastifyCors);
fastify.register(fastifyJwt, {
    secret: "supersecret",
    decoratorName: "jwtUser",
});
fastify.register(fastifyRedis, {
    namespace: "pub",
});
fastify.register(fastifyRedis, {
    namespace: "sub",
});
fastify.register(fastifyMulter.contentParser);

fastify.addHook("preHandler", async function (req) {
    req.query = Object.assign({}, req.query);
    console.log(`[${req.method}] `, req.url, req.body || req.query);
});
//создаём декоратор fastify.auth который мы будем сувать в preHandler
fastify.decorate("auth", () => {
    return async (req: FastifyRequest, res: FastifyReply) => {
        await req.jwtVerify().catch(() => {
            return res.status(401).send({
                code: "NO_AUTH",
                message: "Вы не авторизовались",
            });
        }); //прокидывает req.jwtUser
        req.user = await User.findByPk(req.jwtUser.id);
        if (!req.user)
            return res.status(401).send({
                code: "NO_AUTH",
                message: "Вы не авторизовались",
            });
    };
});

fastify.setErrorHandler((error, req, res) => {
    console.error(error);

    if ("storageErrors" in error)
        return res.status(409).send({
            code: "UPLOAD_ERROR",
            message: error.message,
        });

    if ("validation" in error) {
        return res.status(400).send({
            code: "VALIDATION_ERROR",
            message: "Произошла ошибка валидации",
            errors: error.validation,
        });
    }

    return res.status(500).send({
        error: "SERVER_ERROR",
        message: "На сервере произошла техническая ошибка. Попробуйте позже",
    });
});

glob(`${process.cwd()}/dist/routes/**/*.js`, {
    absolute: true,
}).then(async (routes) => {
    await Promise.all(
        routes.map(async (route) => {
            const file = await import(route);
            const endpoint = file[Object.keys(file)[0]];
            await fastify.register(endpoint);
        })
    );

    fastify
        .listen({
            port: 80,
            host: "::",
        })
        .then((host) =>
            console.log(`[SERVER] Server has been started at ${host}`)
        );
});
