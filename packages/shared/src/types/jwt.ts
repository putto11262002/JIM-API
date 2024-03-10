import jwt from "jsonwebtoken"

export type BaseAuthResource = {
    id: string;
    role: string;

}
export type JWTPayload = BaseAuthResource & jwt.JwtPayload