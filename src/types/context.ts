import { type PrismaClient } from "@prisma/client";
import { type IModelController } from "../controllers/model";
import { type ILogger } from "../utils/logger";
import { type AppConfig } from "./config"
import { type IStaffService } from "../services/staff";
import { type IStaffController } from "../controllers/staff";

export type AppContext =  {
    config: AppConfig;
    logger: ILogger;
}

export type ModelRoutesContext = {
    controller: IModelController
}

export type StaffServiceContext = {
    prisma: PrismaClient
}

export type StaffControllerContext = {
    logger: ILogger
    staffService: IStaffService
}

export type StaffRoutesContext = {
    staffController: IStaffController
}