import type Koa from "koa";
import { CreateStaffSchema } from "../validators/staff";
import ValidationError from "../utils/errors/validation-error";
import { type StaffControllerContext } from "../types/context";
import ApiResponse from "../dtos/responses/api-response";
import { type ILogger } from "../utils/logger";
import { type IStaffService } from "../services/staff";

export interface IStaffController {
    createStaff: Koa.Middleware;
}

class StaffController implements IStaffController {
    private readonly staffService: IStaffService;
    private readonly logger: ILogger;
    constructor(ctx: StaffControllerContext) {
        this.staffService = ctx.staffService;
        this.logger = ctx.logger;
        this.createStaff = this.createStaff.bind(this);
    }

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
        this.logger.info("Staff created successfully");
        ctx.body = new ApiResponse("Staff created successfully", undefined);
    }
}

export default StaffController;
