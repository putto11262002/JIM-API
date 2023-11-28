import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppConfig } from "../types";
import { TYPES } from "../inversify.config";
import type { CreateJwtPayload, JwtPayload } from "../types/jwt";
import UnauthorizedError from "../utils/errors/unauthorised.error";

export interface IAuthService {
    /**
     * @param password Plain text password
     * @returns Hashed password
     */
    hashPassword: (password: string) => Promise<string>;

    /**
     * @param password Plain text password
     * @param hashedPassword Hashed password
     * @returns `true` if the password matches, `false` otherwise
     */
    comparePassword: (
        password: string,
        hashedPassword: string
    ) => Promise<boolean>;
    /**
     * @param payload Payload to be encoded into the token
     * @returns Access token
     */
    generateAccessToken: (payload: CreateJwtPayload) => Promise<string>;
    /**
     * @param payload Payload to be encoded into the token
     * @returns Refresh token
     */
    generateRefreshToken: (payload: CreateJwtPayload) => Promise<string>;
    /**
     * @param token Access token
     * @returns the payload if the token is valid, throws an error otherwise
     */
    verifyAccessToken: (token: string) => JwtPayload;
    /**
     * @param token Refresh token
     * @returns the payload if the token is valid, throws an error otherwise
     */
    verifyRefreshToken: (token: string) => JwtPayload;
}

@injectable()
export class AuthService implements IAuthService {
    private readonly config: AppConfig;

    constructor(@inject(TYPES.CONFIG) config: AppConfig) {
        this.config = config;
    }

    public async hashPassword(password: string): Promise<string> {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    }

    public async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match;
        } catch (err) {
            return false;
        }
    }

    public async generateAccessToken(
        payload: CreateJwtPayload
    ): Promise<string> {
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.jwtAccessTokenExpiration,
        });
    }

    public async generateRefreshToken(payload: any): Promise<string> {
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.jwtRefreshTokenExpiration,
        });
    }

    public verifyAccessToken(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, this.config.jwtSecret);
            return payload as JwtPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Token expired");
            }

            if (err instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError("Invalid token");
            }
            throw err;
        }
    }

    public verifyRefreshToken(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, this.config.jwtSecret);
            return payload as JwtPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Token expired");
            }

            if (err instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError("Invalid token");
            }
            throw err;
        }
    }
}
