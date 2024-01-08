export enum AppErrorType {
  CLIENT_ERROR = "CLIENT_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}
export type AppError = {
  statusCode?: number;
  message: string;
  details?: string;
  type: AppErrorType;
};
