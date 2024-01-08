import { inject, injectable } from "inversify";
import Router from "koa-router";
import ModelRouter from "./model.route";

import { TYPES } from "../inversify.config";

export interface IAppRouter {
    getRoutes: () => Router.IMiddleware;
}

@injectable()
class RootRouter implements IAppRouter {
    private readonly router: Router;

    private readonly modelRouter: ModelRouter;

    private readonly staffRouter: IAppRouter;

    constructor(
        @inject(TYPES.STAFF_ROUTER) staffRouter: IAppRouter,
        @inject(TYPES.MODEL_ROUTER) modelRouter: ModelRouter
    ) {
        this.router = new Router({ prefix: "/api" });
        this.staffRouter = staffRouter;
        this.modelRouter = modelRouter;
        this.router.use(this.modelRouter.getRoutes());
        this.router.use(this.staffRouter.getRoutes());
    }

    getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default RootRouter;
