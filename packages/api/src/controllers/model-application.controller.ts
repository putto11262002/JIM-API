import type Router from "koa-router";
import { inject, injectable, named } from "inversify";
import { ModelApplicationService } from "../services/model-application.service";
import { TYPES } from "../inversify.config";
import type { IAppRouterContext } from "../types/app";
import type { IFileService } from "../services/file.service";

import { getSingleFileFromCtx } from "../utils/file-upload";
import { CreateModelApplicationSchema } from "../validators/model-application";
import ValidationError from "../utils/errors/validation.error";
export interface IModelApplicationController {
    createModelApplication: Router.IMiddleware;
}

@injectable()
export class ModelApplicationController implements IModelApplicationController {
    @inject(TYPES.MODEL_APPLICATION_SERVICE)
    private readonly modelApplicationService!: ModelApplicationService;

    private readonly fileService!: IFileService;

    constructor(
        @inject(TYPES.FILE_SERVICE_FACTORY)
        @named(TYPES.LOCAL_FILE_SERVICE)
        fileServiceFactory: () => IFileService
    ) {
        this.fileService = fileServiceFactory();
    }

    public async createModelApplication(ctx: IAppRouterContext): Promise<void> {
        const uploadedMidlengthImage = getSingleFileFromCtx(
            ctx,
            "midlengthImage"
        );

        const uploadedCloseUpImage = getSingleFileFromCtx(ctx, "closeUpImage");

        const uploadedFullLengthImage = getSingleFileFromCtx(
            ctx,
            "fullLengthImage"
        );

        // const [
        //     midlengthImageMetaData,
        //     closeUpImageMetaData,
        //     fullLengthImageMetaData,
        // ] = await Promise.all([
        //     this.fileService.createFile(uploadedMidlengthImage.filepath),
        //     this.fileService.createFile(uploadedCloseUpImage.filepath),
        //     this.fileService.createFile(uploadedFullLengthImage.filepath),
        // ]);

        // console.log(
        //     midlengthImageMetaData,
        //     closeUpImageMetaData,
        //     fullLengthImageMetaData
        // );

        // const modelApplication = await this.modelApplicationService.createModelApplication({
        //     midlengthImage: midlengthImage,
        //     closeUpImage: closeUpImage.path,
        //     fullLengthImage: fullLengthImage.path,
        //     ...ctx.request.body
        // })

        console.log(ctx.request.body)

        const validation = CreateModelApplicationSchema.safeParse(
            ctx.request.body
        );
        if (!validation.success) {
            throw new ValidationError(
                "Invalid model application payload",
                validation.error.formErrors.fieldErrors
            );
        }

        const modelApplication =
            await this.modelApplicationService.createApplication({
                ...validation.data,
                images: [
                    { path: uploadedMidlengthImage.filepath, type: "mid-length" },
                    { path: uploadedCloseUpImage.filepath, type: "close-up" },
                    {
                        path: uploadedFullLengthImage.filepath,
                        type: "full-length",
                    },
                ],
            });

        console.log(modelApplication);

        ctx.status = 204;
    }
}
