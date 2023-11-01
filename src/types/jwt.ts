export type JwtPayload = {
    id: string;
    role: string;
    iat: number;
    exp: number;
};

export type CreateJwtPayload = Omit<JwtPayload, "iat" | "exp">;
