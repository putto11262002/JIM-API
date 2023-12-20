import Router from "koa-router";
import { type IStaffController } from "../controllers/staff.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
import type { IAppRouter } from "./index.ts";
import { StaffRole } from "@prisma/client";
import AuthMiddleware from "../middlewares/auth.middleware";

@injectable()
class StaffRouter implements IAppRouter {
    private readonly router: Router;

    private readonly staffController: IStaffController;

    private readonly authMiddleware: AuthMiddleware;

    constructor(
        @inject(TYPES.STAFF_CONTROLLER) staffController: IStaffController,
        @inject(TYPES.AUTH_MIDDLEWARE) authMiddleware: AuthMiddleware
    ) {
        this.router = new Router({});
        this.staffController = staffController;
        this.authMiddleware = authMiddleware;
        this.router.post(
            "/admin/staffs",
            authMiddleware.gaurd(StaffRole.ADMIN),
            this.staffController.createStaff.bind(this.staffController)
        );
        this.router.get(
            "/admin/staffs",
            authMiddleware.gaurd(StaffRole.ADMIN),
            this.staffController.getStaffs.bind(this.staffController)
        );

        this.router.get(
            "/staffs/me",
            authMiddleware.gaurd(
                StaffRole.ADMIN,
                StaffRole.BOOKER,
                StaffRole.SCOUT
            ),
            this.staffController.getMe.bind(this.staffController)
        );

        this.router.get(
            "/admin/staffs/:id",
            authMiddleware.gaurd(StaffRole.ADMIN),
            this.staffController.getStaffById.bind(this.staffController)
        );

        this.router.post(
            "/staffs/login",
            this.staffController.login.bind(this.staffController)
        );
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default StaffRouter;
