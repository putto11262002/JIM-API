import { injectable } from "inversify";
import { ConfigSchema } from "./validators/config";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url))

@injectable()
export class AppConfig {
    public readonly port: number;
    public readonly jwtSecret: string;
    public readonly jwtAccessTokenExpiration: string;
    public readonly jwtRefreshTokenExpiration: string;
    public readonly uploadDir: string;
    public readonly serverUrl: string;
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
        this.jwtAccessTokenExpiration = "1m";
        this.jwtRefreshTokenExpiration = "3m";
        this.uploadDir = process.env.UPLOAD_DIR ?? path.join(__dirname, "../uploads");
        this.serverUrl = process.env.SERVER_URL ?? "http://localhost:3001";
    }
}

export default new AppConfig();
