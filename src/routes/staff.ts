import Router from "koa-router";
import { type IStaffController } from "../controllers/staff";
import { type StaffRoutesContext } from "../types/context";

class StaffRoutes {
    private readonly router: Router;
    private readonly controller: IStaffController;
    constructor(ctx: StaffRoutesContext){
        this.router = new Router({})
        this.controller = ctx.staffController

        this.router.post("/admin/staffs", this.controller.createStaff)
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes()
    }
}

export default StaffRoutes