import winston from "winston";

class Logger {
    private readonly winstonLogger: winston.Logger;
    constructor() {
        this.winstonLogger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.simple()
            ),
            transports: [new winston.transports.Console({})],
        });
    }

    public info(message: string, ...meta: any[]): void {
        this.winstonLogger.info(message, ...meta);
    }

    public error(message: string, ...meta: any[]): void {
        this.winstonLogger.error(message, ...meta);
    }

    public warn(message: string, ...meta: any[]): void {
        this.winstonLogger.warn(message, ...meta);
    }

    public debug(message: string, ...meta: any[]): void {
        this.winstonLogger.debug(message, ...meta);
    }
}

export interface ILogger {
    info: (message: string, ...meta: any[]) => void;
    error: (message: string, ...meta: any[]) => void;
    warn: (message: string, ...meta: any[]) => void;
    debug: (message: string, ...meta: any[]) => void;
}

const logger = new Logger();

export default logger;
