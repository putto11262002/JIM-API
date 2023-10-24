import Router from "koa-router";
import { type IModelController } from "../controllers/model";
import { type ModelRoutesContext } from "../types/context";

class ModelRoutes {
    private readonly router: Router;
    private readonly controller: IModelController;
    constructor(context: ModelRoutesContext) {
        this.controller = context.controller;
        this.router = new Router({ prefix: "/model" });
        this.router.get("/", this.controller.getModels);
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default ModelRoutes;
