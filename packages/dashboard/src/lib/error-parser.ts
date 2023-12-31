import { AppError, AppErrorType } from "../types/app-error";
import axios from "axios";
import { ErrorResponse } from "@jimmodel/shared";

export function errorParser(err: unknown): AppError {
  let error: AppError;
  if (axios.isAxiosError<ErrorResponse>(err) && err.response) {
    error = {
      details: err.response.data.details,
      message: err.response.data.message,
      statusCode: err.response.status,
      type:
        err.response.status === 401
          ? AppErrorType.AUTH_ERROR
          : AppErrorType.SERVER_ERROR,
    };
  } else if (axios.isAxiosError<ErrorResponse>(err) && err.request) {
    error = {
      details: err.message,
      message: "Something went wrong. Please try again later",
      type: AppErrorType.CLIENT_ERROR,
    };
  } else {
    error = {
      details: (err as Error).message,
      message: "Something went wrong. Please try again later",
      type: AppErrorType.CLIENT_ERROR,
    };
  }
  return error;
}
