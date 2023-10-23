import winston from "winston";

class Logger {
    private readonly winstonLogger: winston.Logger;
    constructor() {
        this.winstonLogger = winston.createLogger({
            format: winston.format.json(),
            transports: [new winston.transports.Console({})],
        });
    }

    public info(message: string): void {
        this.winstonLogger.info(message);
    }

    public error(message: string): void {
        this.winstonLogger.error(message);
    }

    public warn(message: string): void {
        this.winstonLogger.warn(message);
    }

    public debug(message: string): void {
        this.winstonLogger.debug(message);
    }
}

export interface ILogger {
    info: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
}

export default Logger;
