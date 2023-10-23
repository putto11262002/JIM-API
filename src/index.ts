import ApiServer from "./server";
import { type AppConfig } from "./types";
import Logger from "./utils/logger";
import { ConfigSchema } from "./validators/config";
import dotenv from "dotenv";

dotenv.config();

// Load configs and validate
const configValidation = ConfigSchema.safeParse({
    port: process.env.PORT ?? 3000,
});

if (!configValidation.success) {
    throw new Error(
        configValidation.error.errors
            .map((error) => `${error.path?.[0]}: ${error.message}`)
            .join(", ")
    );
}

const config: AppConfig = configValidation.data;

// Initialize logger
const logger = new Logger();

// Initialize server
const server = new ApiServer(config, logger);

// Start server
server.start();
