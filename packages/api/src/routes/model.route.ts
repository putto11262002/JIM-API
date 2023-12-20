import Router from "koa-router";
import { type IModelController } from "../controllers/model";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config";
import type { IAppRouter } from "./index.ts";

@injectable()
class ModelRouter implements IAppRouter {
    private readonly router: Router;

    private readonly modelController: IModelController;

    constructor(
        @inject(TYPES.MODEL_CONTROLLER) modelController: IModelController
    ) {
        this.router = new Router({ prefix: "/model" });
        this.modelController = modelController;
        this.router.get("/", this.modelController.getModels);
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default ModelRouter;
