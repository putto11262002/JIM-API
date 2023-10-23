import Router from "koa-router";
import { type IModelController } from "../controllers/model";
class ModelRoutes {
    private readonly router: Router;
    private readonly controller: IModelController;
    constructor(_controller: IModelController) {
        this.controller = _controller;
        this.router = new Router({ prefix: "/model" });
        this.router.get("/", this.controller.getModels);
    }

    public getRoutes(): Router.IMiddleware {
        return this.router.routes();
    }
}

export default ModelRoutes;
