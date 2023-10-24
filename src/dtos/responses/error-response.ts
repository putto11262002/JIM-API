class ErrorResponse {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly defails?: any;

    constructor(message: string, statusCode?: number, details?: any) {
        this.message = message;
        this.statusCode = statusCode ?? 500;
        this.defails = details;
    }
}

export default ErrorResponse;