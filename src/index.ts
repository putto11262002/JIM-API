import type App from "./app";

import { TYPES } from "./inversify.config";
import container from "./inversify.container";

// Initialize app
const app = container.get<App>(TYPES.APP);

// Start app
void app.start();
