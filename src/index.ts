import App from "./app";
import appConfig from "./config";
import { type AppContext } from "./types/context";
import logger from "./utils/logger";

const config = appConfig;

const appCtx: AppContext = {
    config,
    logger,
};

// Initialize server
const server = new App(appCtx);

// Start server
void server.start();
