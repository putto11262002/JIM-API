import AppError from "./app-error";
export default class ServerError extends AppError {
  statusCode: number;
  constructor(message: string, statusCode: number, details?: string) {
    super(message, details);
    this.statusCode = statusCode;
  }
}
