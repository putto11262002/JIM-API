import ApiError from "./api-error";

class AuthenticationError extends ApiError {
    constructor(message: string){
        super(message, 401)
        this.name = "AuthenticationError"
    }
}

export default AuthenticationError