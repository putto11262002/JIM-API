import z from "zod"
import dotenv from "dotenv"
dotenv.config()

export const ConfigSchema = z.object({
    PORT: z.number().or(z.string().transform((v) => parseInt(v, 10))).default(3002),
    NODE_ENV: z.string().default("development"),
    SERVER_URL: z.string(),
    SERVE_STATIC_PATH: z.string().default("/public"),
    FILE_STORAGE_PATH: z.string().default("uploads/"),
    JWT_ROUNDS: z.number().or(z.string().transform((v) => parseInt(v, 10))).default(10),
    JWT_SECRET: z.string().default("secret"),
    ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
    SALT_ROUNDS: z.number().or(z.string().transform((v) => parseInt(v, 10))).default(10),
})

export type Config = z.infer<typeof ConfigSchema>

function ParseConfig(): Config {
    const validation = ConfigSchema.safeParse({
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        SERVER_URL: process.env.SERVER_URL,
        SERVE_STATIC_PATH: process.env.SERVE_STATIC_PATH,
        FILE_STORAGE_PATH: process.env.FILE_STORAGE_PATH,
        JWT_ROUNDS: process.env.JWT_ROUNDS,
        JWT_SECRET: process.env.JWT_SECRET,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
    })

    if (!validation.success){
        throw new Error(validation.error.errors.map((e) => `${e.path}: ${e.message}`).join(`\n`))
    }   

    return validation.data
}

const config = ParseConfig()

export default config

