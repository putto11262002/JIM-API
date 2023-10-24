import type { AppConfig } from "./types/config";
import Koa from "koa";
import type { ILogger } from "./utils/logger";
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

        this.registerListeners();

        /**
         * API router
         */
        const apiRouter = new Router({ prefix: "/api" });

        /**
         * Global error handle
         */
        apiRouter.use(ErrorMiddleware());

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
            prisma: this.prisma,
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
        this.koaApp.on("error", (err, ctx: Koa.Context) => {
            this.logger.error(err);
        });
    }

    public stop(): void {
        this.logger.info("Stopping server...");

        const forcefulShutdownTimeout = 1000 * 30;
        const timeout = setTimeout(() => {
            this.logger.error("Forcefully shutting down due to timeout");
            process.exit(1);
        }, forcefulShutdownTimeout);

        if (this.server !== undefined) {
            this.server.close(() => {
                this.logger.info("Closed out remaining connections.");

                this.logger.info("Closing database connection...");
                this.prisma
                    .$disconnect()
                    .then(() => {
                        this.logger.info("Database connection closed");
                        clearTimeout(timeout);
                        process.exit();
                    })
                    .catch((err) => {
                        this.logger.error(
                            "Error closing database connection",
                            err
                        );
                        clearTimeout(timeout);
                        process.exit(1);
                    });
            });
        } else {
            this.logger.warn("Server was not running");
            process.exit(1);
        }
    }

    public async start(): Promise<void> {
        await this.connectToDatabase();
        this.initRoutesAndMiddlewares();
        this.listenToProcessSignals();
        this.startServer();
    }

    private async connectToDatabase(): Promise<void> {
        try {
            this.logger.info("Connecting to database...");
            await prisma.$connect();
            this.logger.info("Connected to database");
        } catch (err) {
            this.logger.error("Failed to connect to database", err);
            process.exit(1);
        }
    }

    private listenToProcessSignals(): void {
        process.on("SIGINT", () => {
            this.stop();
        });
    }

    private startServer(): void {
        this.server = this.koaApp.listen(this.config.port, () => {
            this.logger.info(`Server listening on port ${this.config.port}`);
        });
    }
}

export default App;
