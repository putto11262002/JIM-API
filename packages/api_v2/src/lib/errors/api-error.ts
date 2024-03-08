class ApiError extends Error {
    code: number 
    constructor(message: string, code: number){
        super(message)
        this.name = "ApiError"
        this.code = code || 500
        
    }
}

export default ApiError