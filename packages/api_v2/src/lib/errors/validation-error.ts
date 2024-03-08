import { z } from "zod";
import ApiError from "./api-error";

class ValidationError extends ApiError {
    details?: Record<string, string>
    constructor(message: string, details?: Record<string, string>){
        super(message, 400)
        this.name = "ValidationError"
        this.details = details
    }
}

export function zodErrorToValidationError(error: z.ZodError<any>){
    const details: Record<string, string> = {}
    error.errors.forEach(err => {
        if(err.path){
            details[err.path.join(".")] = err.message
        }
    })
    return new ValidationError("Validation error", details)
}



export default ValidationError