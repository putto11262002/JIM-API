import ApiError from "./api-error";

class ConstraintViolationError extends ApiError {
    constructor(message: string = "Constraint violation") {
        super(message, 400);
        this.name = "ConstraintViolationError";
    }   
}

export default ConstraintViolationError;