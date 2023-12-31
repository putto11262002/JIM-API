import type Router from "koa-router";
import type Koa from "koa";
import type { IAppRouterContext } from "../types/app";
import { AuthService } from "../services/auth.service";
import type ErrorResponse from "../types/dtos/error-response.dto";
import { RoleLevels } from "../constants/role.constant";
import { TYPES } from "../inversify.config";
import { inject, injectable } from "inversify";
import { IStaffService } from "../services/staff.service";

@injectable()
class AuthMiddleware {
    @inject(TYPES.AUTH_SERVICE)
    private readonly authService!: AuthService;

    @inject(TYPES.STAFF_SERVICE)
    private readonly staffService!: IStaffService

    public gaurdStaff(...roles: string[]): Router.IMiddleware {
        return async (ctx: IAppRouterContext, next: Koa.Next) => {
            const authHeader = ctx.request.header.authorization;

            // Check if auth header exist
            if (authHeader == null) {
                ctx.status = 401;
                const response: ErrorResponse = {
                    message: "Invalid token",
                    statusCode: 401,
                };
                ctx.body = response;
                return;
            }

            const [type, token] = authHeader?.split(" ");

            // Check token type
            if (type !== "Bearer") {
                ctx.status = 401;
                const response: ErrorResponse = {
                    message: "Invalid token",
                    statusCode: 401,
                };
                ctx.body = response;
                return;
            }

            // Check if token exist
            if (token.length < 1) {
                ctx.status = 401;
                const response: ErrorResponse = {
                    message: "Invalid token",
                    statusCode: 401,
                };

                ctx.body = response;
                return;
            }

            const { role, id } = this.authService.verifyAccessToken(token);


            // Check if user has logout but token has not expired
            const staff = await this.staffService.getStaffById(id)

            if (staff == null) {
                ctx.status = 401;
                const response: ErrorResponse = {
                    message: "Invalid token",
                    statusCode: 401,
                };

                ctx.body = response;
                return;
            }

            if (staff.logout){
                ctx.status = 401;
                const response: ErrorResponse = {
                    message: "Invalid token",
                    statusCode: 401,
                };

                ctx.body = response;
                return;
            }

        

            const targetLevel = RoleLevels[role] ?? 0;

            let hasPermission = false;

            for (const role of roles) {
                if (RoleLevels[role] >= targetLevel) {
                    hasPermission = true;
                    break;
                }
            }

            if (!hasPermission) {
                ctx.status = 403;
                const response: ErrorResponse = {
                    message: "Forbidden action",
                    statusCode: 403,
                };
                ctx.body = response;
                return;
            }

            ctx.state.auth = {
                id,
                role,
            };

            await next();
        };
    }
}

export default AuthMiddleware;
