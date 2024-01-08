class ValidationError extends Error {
    details?: Record<string, string[]>;
    constructor(message: string, details?: Record<string, string[]>) {
        super(message);
        this.name = "ValidationError";
        this.details = details;
    }
}

export default ValidationError;
