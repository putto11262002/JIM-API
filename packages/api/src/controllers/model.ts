import { injectable } from "inversify";
import type Router from "koa-router";

export interface IModelController {
    getModels: Router.IMiddleware;
    createModel: Router.IMiddleware;
    updateModel: Router.IMiddleware;
    deleteModel: Router.IMiddleware;
    getModelById: Router.IMiddleware;
}

@injectable()
class ModelController implements IModelController {
    public async getModels(ctx: Router.IRouterContext): Promise<void> {}

    public async createModel(ctx: Router.IRouterContext): Promise<void> {}

    public async updateModel(ctx: Router.IRouterContext): Promise<void> {}

    public async deleteModel(ctx: Router.IRouterContext): Promise<void> {}

    public async getModelById(ctx: Router.IRouterContext): Promise<void> {}
}

export default ModelController;
