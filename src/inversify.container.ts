import "reflect-metadata";
import { Container } from "inversify";
import StaffController from "./controllers/staff";
import { TYPES } from "./inversify.config";
import { prisma } from "./prisma/client";
import StaffService from "./services/staff";
import StaffRouter from "./routes/staff";
import RootRouter from "./routes/index.ts";
import App from "./app";
import config from "./config";
import ModelService from "./services/model";
import ModelController from "./controllers/model";
import ModelRouter from "./routes/model";

const container = new Container();
container.bind(TYPES.STAFF_SERVICE).to(StaffService);
container.bind(TYPES.STAFF_CONTROLLER).to(StaffController);
container.bind(TYPES.STAFF_ROUTER).to(StaffRouter);
container.bind(TYPES.ROOT_ROUTER).to(RootRouter);

container.bind(TYPES.MODEL_SERVICE).to(ModelService);
container.bind(TYPES.MODEL_CONTROLLER).to(ModelController);
container.bind(TYPES.MODEL_ROUTER).to(ModelRouter);

container.bind(TYPES.CONFIG).toConstantValue(config);
container.bind(TYPES.APP).to(App);
container.bind(TYPES.PRISMA).toConstantValue(prisma);

export default container;
