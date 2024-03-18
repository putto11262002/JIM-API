import ApiError from "./api-error";

class AuthorizationError extends ApiError {
    constructor(message: string) {
        super(message, 403);
    }   
}

export default AuthorizationError;