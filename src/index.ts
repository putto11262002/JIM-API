import App from "./app";
import appConfig from "./config";
import { type AppContext } from "./types/context";
import logger from "./utils/logger";


const config = appConfig;

// Initialize logger



const appCtx: AppContext = {
    config,
    logger
}

// Initialize server
const server = new App(appCtx);

// Start server
server.start();
