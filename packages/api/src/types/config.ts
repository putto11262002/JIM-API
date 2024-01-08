export type AppConfig = {
    /**
     * @description Port to run the server on. Default to 3000.
     */
    port: number;
    /**
     * @description Secret used to sign JWT tokens. Default to 'secret'.
     */
    jwtSecret: string;
    /**
     * @description String describing a time span: https://github.com/vercel/ms
     */
    jwtAccessTokenExpiration: string;
    /**
     * @description String describing a time span: https://github.com/vercel/ms
     */
    jwtRefreshTokenExpiration: string;
};
