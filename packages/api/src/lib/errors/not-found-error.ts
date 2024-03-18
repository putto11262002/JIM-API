import ApiError from "./api-error";

class NotFoundError extends ApiError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
        this.name = "NotFoundError";
    }   
}

export default NotFoundError;