import Router from "koa-router";
import type { IAppRouter } from "./index.ts.js";
import { IModelApplicationController } from "../controllers/model-application.controller.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.config.js";
import { UploadMiddleware } from "../middlewares/upload.middleware.js";

@injectable()
export class ModelApplicationRouter implements IAppRouter {
    private readonly router: Router;


    private readonly modelApplicationController: IModelApplicationController;

    constructor(
        @inject(TYPES.MODEL_APPLICATION_CONTROLLER) 
        modelApplicationController: IModelApplicationController
    ){
        this.modelApplicationController = modelApplicationController;
        this.router = new Router({})
        this.router.post(
            "/model-applications",
            ...UploadMiddleware({allowedMimetype: ["image/png", "image/jpeg"]}),
            this.modelApplicationController.createModelApplication.bind(this.modelApplicationController)    
        )
    }

    public getRoutes():  Router.IMiddleware {
        return this.router.routes();
    }
}