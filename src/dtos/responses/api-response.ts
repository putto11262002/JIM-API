class ApiResponse {
    public message: string;
    public data: unknown;
    constructor(message: string, data: unknown) {
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;
