import { JWTPayload } from "../src/types/jwt";

declare global {
    declare namespace Express {
        interface Request {
            auth: JWTPayload
        }
    }
}