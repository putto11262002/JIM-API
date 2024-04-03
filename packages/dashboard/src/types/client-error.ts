import AppError from "./app-error";

export default class ClientError extends AppError {
  constructor(message: string, details?: string) {
    super(message, details);
  }
}
