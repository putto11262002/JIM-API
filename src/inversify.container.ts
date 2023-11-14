import "reflect-metadata";
import { Container } from "inversify";
import StaffController from "./controllers/staff.controller";
import { TYPES } from "./inversify.config";
import { prisma } from "./prisma/client";
import StaffService from "./services/staff.service";
import StaffRouter from "./routes/staff.route";
import RootRouter from "./routes/index.ts";
import App from "./app";
import config from "./config";
import ModelService from "./services/model";
import ModelController from "./controllers/model";
import ModelRouter from "./routes/model";
import { AuthService } from "./services/auth";
import logger from "./utils/logger";
import AuthMiddleware from "./middlewares/auth.middleware";

const container = new Container();
container.bind(TYPES.STAFF_SERVICE).to(StaffService);
container.bind(TYPES.STAFF_CONTROLLER).to(StaffController);
container.bind(TYPES.STAFF_ROUTER).to(StaffRouter);
container.bind(TYPES.ROOT_ROUTER).to(RootRouter);

container.bind(TYPES.MODEL_SERVICE).to(ModelService);
container.bind(TYPES.MODEL_CONTROLLER).to(ModelController);
container.bind(TYPES.MODEL_ROUTER).to(ModelRouter);

container.bind(TYPES.AUTH_SERVICE).to(AuthService);

container.bind(TYPES.CONFIG).toConstantValue(config);
container.bind(TYPES.APP).to(App);
container.bind(TYPES.PRISMA).toConstantValue(prisma);
container.bind(TYPES.LOGGER).toConstantValue(logger);
container.bind(TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware);

export default container;
