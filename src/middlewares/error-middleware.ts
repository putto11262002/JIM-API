import ErrorResponse from "../dtos/responses/error-response";
import ValidationError from "../utils/errors/validation-error";
import type Koa from "koa";

function ErrorMiddleware() {
    return async function (ctx: Koa.Context, next: Koa.Next) {
        try {
            await next();
        } catch (err) {
            console.log("Error");
            if (err instanceof ValidationError) {
                ctx.body = new ErrorResponse(err.message, 400, err.details);
                return;
            }

            ctx.status = 500;
            ctx.body = new ErrorResponse("Internal server error", 500);
        }
    };
}

export default ErrorMiddleware;
