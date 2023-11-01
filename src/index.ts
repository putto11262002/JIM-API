import container from "./inversify.container";
import type App from "./app";
import { TYPES } from "./inversify.config";

// Initialize app
const app = container.get<App>(TYPES.APP);

// Start app
void app.start();
