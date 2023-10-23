import type Koa from "koa";

export interface IModelController {
    getModels: Koa.Middleware;
    createModel: Koa.Middleware;
    updateModel: Koa.Middleware;
    deleteModel: Koa.Middleware;
    getModelById: Koa.Middleware;
}

class ModelController implements IModelController {
    public async getModels(ctx: Koa.Context): Promise<void> {}

    public async createModel(ctx: Koa.Context): Promise<void> {}

    public async updateModel(ctx: Koa.Context): Promise<void> {}

    public async deleteModel(ctx: Koa.Context): Promise<void> {}

    public async getModelById(ctx: Koa.Context): Promise<void> {}
}

export default ModelController;
