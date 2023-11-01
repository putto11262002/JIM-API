import type Koa from "koa";
import { CreateStaffSchema } from "../validators/staff";
import ValidationError from "../utils/errors/validation-error";
import ApiResponse from "../dtos/responses/api-response";
import { type IStaffService } from "../services/staff";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
export interface IStaffController {
    createStaff: Koa.Middleware;
}

@injectable()
class StaffController implements IStaffController {
    @inject(TYPES.STAFF_SERVICE)
    private readonly staffService!: IStaffService;

    public async createStaff(ctx: Koa.Context): Promise<void> {
        const validation = CreateStaffSchema.safeParse(ctx.request.body);
        if (!validation.success) {
            throw new ValidationError(
                "Invalid payload",
                validation.error.formErrors.fieldErrors
            );
        }
        const staffPayload = validation.data;
        await this.staffService.createStaff(staffPayload);
        ctx.body = new ApiResponse("Staff created successfully", undefined);
    }

    public async login(ctx: Koa.Context): Promise<void> {}

    public async getStaffById(ctx: Koa.Context): Promise<void> {}

    public async getStaffs(ctx: Koa.Context): Promise<void> {}

    public async getMe(ctx: Koa.Context): Promise<void> {}
}

export default StaffController;
