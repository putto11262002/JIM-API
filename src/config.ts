import { injectable } from "inversify";
import { ConfigSchema } from "./validators/config";
import dotenv from "dotenv";

dotenv.config();

@injectable()
class AppConfig {
    public readonly port: number;
    constructor() {
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

        const data = configValidation.data;

        this.port = data.port;
    }
}

export default new AppConfig();
