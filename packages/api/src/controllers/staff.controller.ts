import {
    type ApiResponse,
    type StaffLoginResult,
    type StaffWithoutPassword,
    type StaffRefreshTokenResult,
} from "@jimmodel/shared";
import ValidationError from "../utils/errors/validation.error";
import {    CreateStaffSchema,
    StaffLoginSchema,
    StaffQuerySchema,
    StaffRefreshTokenSchema,
    UpdateStaffPasswordSchema,
    UpdateStaffSchema,} from "../validators/staff"

import { type IStaffService } from "../services/staff.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
import type Router from "koa-router";
import NotFoundError from "../utils/errors/not-found.error";
import type { IAppRouterContext } from "../types/app";
import type { PaginatedData } from "../types/paginated-data";
import { InvalidArgumentError } from "../utils/errors/invalid-argument.error";
export interface IStaffController {
    createStaff: Router.IMiddleware;
    login: Router.IMiddleware;
    getStaffById: Router.IMiddleware;
    getStaffs: Router.IMiddleware;
    getMe: Router.IMiddleware;
    refreshToken: Router.IMiddleware;
    logout: Router.IMiddleware;
    updateStaffById: Router.IMiddleware;
    updateStaffPasswordById: Router.IMiddleware
}
@injectable()
class StaffController implements IStaffController {
    @inject(TYPES.STAFF_SERVICE)
    private readonly staffService!: IStaffService;

    public async createStaff(ctx: IAppRouterContext): Promise<void> {
        const validation = CreateStaffSchema.safeParse(ctx.request.body);

        if (!validation.success) {
            throw new ValidationError(
                "Invalid payload",
                validation.error.formErrors.fieldErrors
            );
        }
        const staffPayload = validation.data;
        await this.staffService.createStaff(staffPayload);
        const response: ApiResponse = {
            message: "Staff created successfully",
            data: undefined,
        };
        ctx.body = response;
    }

    public async login(ctx: IAppRouterContext): Promise<void> {
        const validation = StaffLoginSchema.safeParse(ctx.request.body);
        if (!validation.success) {
            throw new ValidationError(
                "Invalid staff login payload",
                validation.error.formErrors.fieldErrors
            );
        }

        const { usernameOrEmail, password } = validation.data;
        const loginResult = await this.staffService.login(
            usernameOrEmail,
            password
        );

        const response: ApiResponse<StaffLoginResult> = {
            message: "Login successful",
            data: loginResult,
        };
        ctx.body = response;
    }

    public async getStaffById(ctx: IAppRouterContext): Promise<void> {
        const { id } = ctx.params;
        const staff = await this.staffService.getStaffById(id);
        if (staff == null) {
            throw new NotFoundError("Staff does not exist");
        }

        const response: ApiResponse<StaffWithoutPassword> = {
            data: staff,
        };

        ctx.body = response;
    }

    public async getStaffs(ctx: IAppRouterContext): Promise<void> {
        const validation = StaffQuerySchema.safeParse(ctx.query);
        if (!validation.success) {
            throw new ValidationError(
                "invalid query",
                validation.error.formErrors.fieldErrors
            );
        }

        const { q, roles, sortBy, sortOrder, pageSize, page } = validation.data;
        const paginatedStaffs = await this.staffService.getStaffs({
            q,
            roles,
            sortBy,
            sortOrder,
            page,
            pageSize,
        });

        const response: ApiResponse<PaginatedData<StaffWithoutPassword>> = {
            data: paginatedStaffs,
        };

        ctx.body = response;
    }

    public async getMe(ctx: IAppRouterContext): Promise<void> {
        const auth = ctx.state.auth;

        const staff = await this.staffService.getStaffById(auth.id);

        if (staff === null) {
            throw new InvalidArgumentError(
                "Id in auth does not match any staff"
            );
        }

        const response: ApiResponse<StaffWithoutPassword> = {
            data: staff,
        };

        ctx.body = response;
    }

    public async refreshToken(ctx: IAppRouterContext): Promise<void> {
        const validation = StaffRefreshTokenSchema.safeParse(ctx.request.body);

        if (!validation.success) {
            throw new ValidationError(
                "Invalid payload",
                validation.error.formErrors.fieldErrors
            );
        }

        const { token } = validation.data;

        const result = await this.staffService.refresh(token);

        const response: ApiResponse<StaffRefreshTokenResult> = {
            data: result,
        };

        ctx.body = response;
    }

    public async logout(ctx: IAppRouterContext): Promise<void> {
        const auth = ctx.state.auth;
        await this.staffService.logout(auth.id);
        ctx.status = 204;
    }

    public async updateStaffById(ctx: IAppRouterContext): Promise<void> {
        const validation = UpdateStaffSchema.safeParse(ctx.request.body)
        if (!validation.success){
            throw new ValidationError("invalid update staff payload", validation.error.formErrors.fieldErrors)
        }
        const {id} = ctx.params
        await this.staffService.updateStaff(id, validation.data)
        ctx.status = 204
    }

    public async updateStaffPasswordById(ctx: IAppRouterContext): Promise<void> {
        const validation = UpdateStaffPasswordSchema.safeParse(ctx.request.body)
        if (!validation.success){
            throw new ValidationError("invalid update staff password payload", validation.error.formErrors.fieldErrors)
        }
        const {id} = ctx.params
        await this.staffService.updateStaffPassword(id, validation.data)
        ctx.status = 204
    }


}

export default StaffController;
