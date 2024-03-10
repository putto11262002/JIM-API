import { JWTPayload } from "@jimmodel/shared/src/types/jwt";

declare global {
    declare namespace Express {
        interface Request {
            auth: JWTPayload
        }
    }
}