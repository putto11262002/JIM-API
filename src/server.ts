import { type AppConfig } from "./types/config";
import Koa from "koa";
import { type ILogger } from "./utils/logger";
import Router from "koa-router";
import ModelRoutes from "./routes/model";
import ModelController from "./controllers/model";
import { type Server } from "http";
class ApiServer {
    private readonly config: AppConfig;
    private readonly app: Koa;
    private readonly logger: ILogger;
    private server: Server | undefined;
    constructor(config: AppConfig, logger: ILogger) {
        this.config = config;
        this.app = new Koa();
        this.logger = logger;
        this.initRoutesAndMiddlewares();

        process.on("SIGINT", () => {
            this.stop();
        });
    }

    private initRoutesAndMiddlewares(): void {
        const apiRouter = new Router({ prefix: "/api" });
        const modelController = new ModelController();
        const modelRoutes = new ModelRoutes(modelController);
        apiRouter.use(modelRoutes.getRoutes());
        this.app.use(apiRouter.routes());
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

    public start(): void {
        this.server = this.app.listen(this.config.port, () => {
            this.logger.info(`Server listening on port ${this.config.port}`);
        });
    }
}

export default ApiServer;
