import Router from "koa-router";
import { type IStaffController } from "../controllers/staff";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
import type { IAppRouter } from "./index.ts";

@injectable()
class StaffRouter implements IAppRouter {
    private readonly router: Router;

    private readonly staffController: IStaffController;

    constructor(
        @inject(TYPES.STAFF_CONTROLLER) staffController: IStaffController
    ) {
        this.router = new Router({});
        this.staffController = staffController;
        this.router.post("/admin/staffs", this.staffController.createStaff);
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default StaffRouter;
