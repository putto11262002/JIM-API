import { injectable } from "inversify";
import { ConfigSchema } from "./validators/config";
import dotenv from "dotenv";

dotenv.config();

@injectable()
class AppConfig {
    public readonly port: number;
    public readonly jwtSecret: string;
    public readonly jwtAccessTokenExpiration: string;
    public readonly jwtRefreshTokenExpiration: string;
    constructor() {
        // Load configs and validate
        const configValidation = ConfigSchema.safeParse({
            port: process.env.PORT ?? 3000,
            jwtSecret: process.env.JWT_SECRET,
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
        this.jwtSecret = data.jwtSecret ?? "secret";
        this.jwtAccessTokenExpiration = "10m";
        this.jwtRefreshTokenExpiration = "1y";
    }
}

export default new AppConfig();
