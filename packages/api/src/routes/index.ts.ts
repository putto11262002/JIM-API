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

    private readonly modelApplicationRouter: IAppRouter;

    constructor(
        @inject(TYPES.STAFF_ROUTER) staffRouter: IAppRouter,
        @inject(TYPES.MODEL_ROUTER) modelRouter: ModelRouter,
        @inject(TYPES.MODEL_APPLICATION_ROUTER) modelApplicationRouter: IAppRouter
    ) {
        this.router = new Router({ prefix: "/api" });
        this.staffRouter = staffRouter;
        this.modelRouter = modelRouter;
        this.modelApplicationRouter = modelApplicationRouter;
        this.router.use(this.modelRouter.getRoutes());
        this.router.use(this.staffRouter.getRoutes());
        this.router.use(this.modelApplicationRouter.getRoutes());
    }

    getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default RootRouter;
