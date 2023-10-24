import type { AppConfig } from "./types/config";
import Koa from "koa";
import type {  ILogger } from "./utils/logger";
import Router from "koa-router";
import ModelRoutes from "./routes/model";
import ModelController from "./controllers/model";
import type { Server } from "http";
import type {
    ModelRoutesContext,
    AppContext,
    StaffServiceContext,
    StaffControllerContext,
    StaffRoutesContext,
} from "./types/context";
import koaBody from "koa-body";
import StaffService from "./services/staff";
import { prisma } from "./prisma/client";
import StaffController from "./controllers/staff";
import StaffRoutes from "./routes/staff";
import ErrorMiddleware from "./middlewares/error-middleware";
import type { PrismaClient } from "@prisma/client";

class App {
    private readonly config: AppConfig;
    private readonly koaApp: Koa;
    private readonly logger: ILogger;
    private server: Server | undefined;
    private readonly prisma: PrismaClient;
    constructor(ctx: AppContext) {
        this.config = ctx.config;
        this.koaApp = new Koa();
        this.logger = ctx.logger;
        this.prisma = prisma;
    }

    private initRoutesAndMiddlewares(): void {

        /**
         * Register event listeners
         */

        this.registerListeners()

        /**
         * API router
         */
        const apiRouter = new Router({ prefix: "/api" });

        /**
         * Global error handle
         */
        apiRouter.use(ErrorMiddleware())

        apiRouter.use(koaBody());

        /**
         * Model routes initialisation
         */
        const modelController = new ModelController();
        const modelRoutesCtx: ModelRoutesContext = {
            controller: modelController,
        };
        const modelRoutes = new ModelRoutes(modelRoutesCtx);
        apiRouter.use(modelRoutes.getRoutes());

        /**
         * Staff routes initialisation
         */
        const staffServiceCtx: StaffServiceContext = {
            prisma: this.prisma
        };
        const staffService = new StaffService(staffServiceCtx);
        const staffControllerContext: StaffControllerContext = {
            staffService,
            logger: this.logger,
        };
        const staffController = new StaffController(staffControllerContext);
        const staffRoutesCtx: StaffRoutesContext = {
            staffController,
        };
        const staffRoutes = new StaffRoutes(staffRoutesCtx);
        apiRouter.use(staffRoutes.getRoutes());

      
        /**
         * Mount api router
         */
        this.koaApp.use(apiRouter.routes());
    }


    private registerListeners(): void {
        /**
         * Error logger
         */
        this.koaApp.on('error', (err, ctx: Koa.Context) => {
            this.logger.error(err)
        });
    }

    public stop(): void {
        this.logger.info("Stopping server...");
        this.server?.close(() => {
            this.logger.info("Closed out remaining connections.");
            process.exit();
        });

        setTimeout(() => {
            this.logger.error(
                "Could not close connections in time, forcefully shutting down"
            );
            process.exit(1);
        }, 1000 * 30);
    }

    public async start(): Promise<void> {
        // Contect to database
        this.logger.info("Connecting to database...");
        await prisma.$connect();
        this.logger.info("Connected to database");

        // Set up routes and middlewares
        this.initRoutesAndMiddlewares();

        process.on("SIGINT", () => {
            this.stop();
        });

        this.server = this.koaApp.listen(this.config.port, () => {
            this.logger.info(`Server listening on port ${this.config.port}`);
        });
    }
}

export default App;
