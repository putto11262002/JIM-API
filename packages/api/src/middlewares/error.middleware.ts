import container from "../inversify.container";
import type ErrorResponse from "../types/dtos/error-response.dto";
import ForbiddenError from "../utils/errors/forbidden.error";
import ValidationError from "../utils/errors/validation.error";
import type Koa from "koa";
import type { ILogger } from "../utils/logger";
import type Router from "koa-router";
import { TYPES } from "../inversify.config";
import NotFoundError from "../utils/errors/not-found.error";
import AuthenticationError from "../utils/errors/authentication.error";

function ErrorMiddleware(): Router.IMiddleware {
    const logger = container.get<ILogger>(TYPES.LOGGER);
    return async function (ctx: Koa.Context, next: Koa.Next) {
        try {
            await next();
        } catch (err) {
            logger.error("", err);
            if (err instanceof ValidationError) {
                const response: ErrorResponse = {
                    message: err.message,
                    statusCode: 400,
                    details: err.details,
                };
                ctx.status = 400;
                ctx.body = response;
                return;
            }

            if (err instanceof AuthenticationError) {
                const response: ErrorResponse = {
                    message: err.message,
                    statusCode: 401,
                };
                ctx.status = 401
                ctx.body = response;
                return;
            }

            if (err instanceof ForbiddenError) {
                const response: ErrorResponse = {
                    message: err.message,
                    statusCode: 403,
                };
                ctx.status = 403;
                ctx.body = response;
                return;
            }

            if (err instanceof NotFoundError) {
                const response: ErrorResponse = {
                    message: err.message,
                    statusCode: 403,
                };
                ctx.status = 404;
                ctx.body = response;
                return;
            }

            ctx.status = 500;
            const response: ErrorResponse = {
                message: "Internal server error",
                statusCode: 500,
            };
            ctx.status = 500;
            ctx.body = response;
        }
    };
}

export default ErrorMiddleware;
