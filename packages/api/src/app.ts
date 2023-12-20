import { AppConfig } from "./types/config";
import Koa from "koa";
import type { ILogger } from "./utils/logger";
import type { Server } from "http";
import koaBody from "koa-body";
import ErrorMiddleware from "./middlewares/error.middleware";
import { PrismaClient } from "@jimmodel/db";
import { TYPES } from "./inversify.config";
import { IAppRouter } from "./routes/index.ts";
import { inject, injectable } from "inversify";
import logger from "./utils/logger";
import ConstraintViolationError from "./utils/errors/conflict.error";
import { IStaffService } from "./services/staff.service";

@injectable()
class App {
    @inject(TYPES.CONFIG)
    private readonly config!: AppConfig;

    private readonly koaApp: Koa;

    private readonly logger: ILogger;

    private server!: Server;

    @inject(TYPES.STAFF_SERVICE)
    private readonly staffService!: IStaffService;

    @inject(TYPES.ROOT_ROUTER)
    private readonly router!: IAppRouter;

    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

    constructor() {
        this.koaApp = new Koa();
        this.logger = logger;
    }

    private initRoutesAndMiddlewares(): void {
        /**
         * Global error handle
         */
        this.koaApp.use(koaBody());

        this.koaApp.use(ErrorMiddleware());

        this.koaApp.use(this.router.getRoutes());
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
                this.koaApp.removeAllListeners();
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
        this.registerListeners();
        this.initRoutesAndMiddlewares();
        this.listenToProcessSignals();
        this.startServer();
        await this.createStaffRootUser();
    }

    private async createStaffRootUser(): Promise<void> {
        try {
            await this.staffService.createStaff({
                email: "root@example.com",
                username: "root",
                password: "password",
                firstName: "Root",
                lastName: "User",
                role: "ADMIN",
            });
        } catch (err) {
            if (err instanceof ConstraintViolationError) {
                return;
            }
            this.logger.error("Failed to create root user", err);
        }
    }

    private async connectToDatabase(): Promise<void> {
        try {
            this.logger.info("Connecting to database...");
            await this.prisma.$connect();
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
