import "reflect-metadata";
import { Container } from "inversify";
import { AuthService } from "../auth.service";
import { TYPES } from "../../inversify.config";
import type { AppConfig } from "../../config";
import bcrypt from "bcrypt";
import type { CreateJwtPayload, JwtPayload } from "../../types/jwt";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../../utils/errors/unauthorised.error";

jest.mock("jsonwebtoken");
jest.mock("bcrypt");
describe("AuthService", () => {
    let authService: AuthService;
    let config: Partial<AppConfig>;

    beforeEach(() => {
        const container = new Container();
        config = {
            jwtAccessTokenExpiration: "1h",
            jwtRefreshTokenExpiration: "1d",
            jwtSecret: "secret",
            // bcryptSaltOrRound: 10
        };
        container.bind(TYPES.CONFIG).toConstantValue(config);
        authService = container.resolve(AuthService);
        jest.mock("bcrypt");
        jest.mock("jsonwebtoken");
    });

    describe("hashPassword", () => {
        it("should return hashed password", async () => {
            const saltRound = 10;
            const plainPassword = "plainpassword";
            const hashedPasssword = "hashedPassword";

            bcrypt.hash = jest.fn().mockResolvedValue(hashedPasssword);

            const hashed = await authService.hashPassword(plainPassword);
            expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, saltRound);
            expect(hashed).toEqual(hashedPasssword);
        });
    });

    describe("comparePassword", () => {
        it("should return true if password is correct", async () => {
            const plain = "plainpassword";
            const hashedPassword = "hashedpassword";

            bcrypt.compare = jest.fn().mockResolvedValue(true);

            const result = await authService.comparePassword(
                plain,
                hashedPassword
            );

            expect(result).toBeTruthy();
            expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashedPassword);
        });

        it("should return false if password is incorrect", async () => {
            const randomPlan = "randomplainpassword";
            const hashedPassword = "hashedpassword";

            bcrypt.compare = jest.fn().mockRejectedValue(false);

            const result = await authService.comparePassword(
                randomPlan,
                hashedPassword
            );

            expect(result).toBeFalsy();
            expect(bcrypt.compare).toHaveBeenCalledWith(
                randomPlan,
                hashedPassword
            );
        });
    });

    describe("generateAccessToken", () => {
        it("should return access token", async () => {
            const payload: CreateJwtPayload = {
                id: "uuid",
                role: "role",
            };

            const expectedToken = "token";

            jwt.sign = jest.fn().mockReturnValue(expectedToken);

            const token = await authService.generateAccessToken(payload);

            expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwtSecret, {
                expiresIn: config.jwtAccessTokenExpiration,
            });
            expect(token).toEqual(expectedToken);
        });
    });

    describe("generateRefreshToken", () => {
        it("should return refresh token", async () => {
            const payload: CreateJwtPayload = {
                id: "uuid",
                role: "role",
            };

            const expectedToken = "token";

            jwt.sign = jest.fn().mockReturnValue(expectedToken);

            const token = await authService.generateRefreshToken(payload);

            expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwtSecret, {
                expiresIn: config.jwtRefreshTokenExpiration,
            });
            expect(token).toEqual(expectedToken);
        });
    });

    describe("verifyAccessToken", () => {
        it("should return payload if token is valid", async () => {
            const payload: JwtPayload = {
                id: "uuid",
                role: "role",
                exp: 1234567890,
                iat: 1234567890,
            };

            const token = "token";

            jwt.verify = jest.fn().mockReturnValue(payload);

            const result = authService.verifyAccessToken(token);

            expect(result).toEqual(payload);
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });

        it("should throw unauthorised error if token is expired", async () => {
            const token = "token";

            jwt.verify = jest.fn().mockImplementation(() => {
                throw new jwt.TokenExpiredError("Token expired", new Date());
            });

            expect(() => authService.verifyAccessToken(token)).toThrow(
                UnauthorizedError
            );
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });

        it("should throw error if token is invalid", async () => {
            const token = "token";

            jwt.verify = jest.fn().mockImplementation(() => {
                throw new jwt.JsonWebTokenError("Invalid token");
            });

            expect(() => authService.verifyAccessToken(token)).toThrow(
                UnauthorizedError
            );
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });
    });

    describe("verifyRefreshToken", () => {
        it("should return payload if token is valid", async () => {
            const payload: JwtPayload = {
                id: "uuid",
                role: "role",
                exp: 1234567890,
                iat: 1234567890,
            };

            const token = "token";

            jwt.verify = jest.fn().mockReturnValue(payload);

            const result = authService.verifyRefreshToken(token);

            expect(result).toEqual(payload);
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });

        it("should throw unauthorised error if token is expired", async () => {
            const token = "token";

            jwt.verify = jest.fn().mockImplementation(() => {
                throw new jwt.TokenExpiredError("Token expired", new Date());
            });

            expect(() => authService.verifyRefreshToken(token)).toThrow(
                UnauthorizedError
            );
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });

        it("should throw error if token is invalid", async () => {
            const token = "token";

            jwt.verify = jest.fn().mockImplementation(() => {
                throw new jwt.JsonWebTokenError("Invalid token");
            });

            expect(() => authService.verifyRefreshToken(token)).toThrow(
                UnauthorizedError
            );
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
        });
    });
});
