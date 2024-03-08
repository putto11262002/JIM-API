import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import StaffController from "./controllers/staff.controller";
import { TYPES } from "./inversify.config";
import { prisma } from "./prisma/client";
import StaffService from "./services/staff.service";
import StaffRouter from "./routes/staff.route";
import RootRouter from "./routes/index.ts";
import App from "./app";
import config from "./config";
import ModelService from "./services/model.service";
import ModelController from "./controllers/model";
import ModelRouter from "./routes/model.route";
import { AuthService } from "./services/auth.service";
import logger from "./utils/logger";
import AuthMiddleware from "./middlewares/auth.middleware";
import { EmailService } from "./services/email.service";
import { ModelApplicationService } from "./services/model-application.service";
import { ModelApplicationController } from "./controllers/model-application.controller";
import { ModelApplicationRouter } from "./routes/model-application.router";
import {
    type FileServiceOptions,
    LocalFileService,
} from "./services/file.service";

const container = new Container();
container.bind(TYPES.STAFF_SERVICE).to(StaffService);
container.bind(TYPES.STAFF_CONTROLLER).to(StaffController);
container.bind(TYPES.STAFF_ROUTER).to(StaffRouter);
container.bind(TYPES.ROOT_ROUTER).to(RootRouter);

container.bind(TYPES.MODEL_SERVICE).to(ModelService);
container.bind(TYPES.MODEL_CONTROLLER).to(ModelController);
container.bind(TYPES.MODEL_ROUTER).to(ModelRouter);

container.bind(TYPES.AUTH_SERVICE).to(AuthService);

container.bind(TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope();

container.bind(TYPES.MODEL_APPLICATION_SERVICE).to(ModelApplicationService);
container
    .bind(TYPES.MODEL_APPLICATION_CONTROLLER)
    .to(ModelApplicationController);
container.bind(TYPES.MODEL_APPLICATION_ROUTER).to(ModelApplicationRouter);

container
    .bind(TYPES.FILE_SERVICE_FACTORY)
    .toFactory((context: interfaces.Context) => {
        return (
            options: FileServiceOptions = {
                uploadDir: config.uploadDir,
                baseUrl: new URL("/uploads/", config.serverUrl).toString(),
            }
        ) => {
            return new LocalFileService(options);
        };
    })
    .whenTargetNamed(TYPES.LOCAL_FILE_SERVICE);

container.bind(TYPES.FILE_SERVICE).toDynamicValue(
    (context) =>
        new LocalFileService({
            uploadDir: config.uploadDir,
            baseUrl: new URL("/uploads/", config.serverUrl).toString(),
        })
).whenTargetNamed(TYPES.LOCAL_FILE_SERVICE);

container.bind(TYPES.CONFIG).toConstantValue(config);
container.bind(TYPES.APP).to(App);
container.bind(TYPES.PRISMA).toConstantValue(prisma);
container.bind(TYPES.LOGGER).toConstantValue(logger);
container.bind(TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware);

export default container;
