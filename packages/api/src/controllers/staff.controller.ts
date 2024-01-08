import {
    CreateStaffSchema,
    StaffLoginSchema,
    StaffQuerySchema,
    type StaffResponseDTO,
    type StaffLoginResponseDTO,
    StaffRefreshTokenSchema,
    type ApiResponse,
    type StaffRefreshTokenResponseDTO,
} from "@jimmodel/shared";
import ValidationError from "../utils/errors/validation.error";

import { type IStaffService } from "../services/staff.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
import type Router from "koa-router";
import NotFoundError from "../utils/errors/not-found.error";
import type { IAppRouterContext } from "../types/app";
import { mapStaffToResponse } from "../utils/mappers/staff";
import type { PaginatedData } from "../types/paginated-data";
export interface IStaffController {
    createStaff: Router.IMiddleware;
    login: Router.IMiddleware;
    getStaffById: Router.IMiddleware;
    getStaffs: Router.IMiddleware;
    getMe: Router.IMiddleware;
    refreshToken: Router.IMiddleware;
    logout: Router.IMiddleware;
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

        const staffLoginResponse: StaffLoginResponseDTO = {
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken,
            staff: mapStaffToResponse(loginResult.staff),
        };
        const response: ApiResponse<StaffLoginResponseDTO> = {
            message: "Login successful",
            data: staffLoginResponse,
        };
        ctx.body = response;
    }

    public async getStaffById(ctx: IAppRouterContext): Promise<void> {
        const { id } = ctx.params;
        const staff = await this.staffService.getStaffById(id);
        if (staff == null) {
            throw new NotFoundError("Staff does not exist");
        }

        const staffResponse: StaffResponseDTO = mapStaffToResponse(staff);

        const response: ApiResponse<StaffResponseDTO> = {
            data: staffResponse,
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

        const response: ApiResponse<PaginatedData<StaffResponseDTO>> = {
            data: paginatedStaffs,
        };

        ctx.body = response;
    }

    public async getMe(ctx: IAppRouterContext): Promise<void> {
        const auth = ctx.state.auth;

        const staff = await this.staffService.getStaffById(auth.id);

        if (staff === null) {
            throw Error("Id in auth does not match any staff");
        }

        const staffResponse: StaffResponseDTO = mapStaffToResponse(staff);

        const response: ApiResponse<StaffResponseDTO> = {
            data: staffResponse,
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

        const response: ApiResponse<StaffRefreshTokenResponseDTO> = {
            data: {
                staff: mapStaffToResponse(result.staff),
                refreshToken: result.refreshToken,
                accessToken: result.accessToken,
            },
        };

        ctx.body = response;
    }

    public async logout(ctx: IAppRouterContext): Promise<void> {
        const auth = ctx.state.auth;
        await this.staffService.logout(auth.id);
        ctx.status = 204;
    }
}

export default StaffController;
