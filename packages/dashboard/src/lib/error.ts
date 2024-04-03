import AppError from "../types/app-error";
import ClientError from "../types/client-error";
import ServerError from "../types/server-error";
import axios from "axios";
import { ErrorResponse } from "@jimmodel/shared";
import { store } from "../redux/store";
import { unauthenticate } from "../redux/auth-reducer";

export function standardiseError(err: unknown): AppError {
  // Handle axios error
  if (axios.isAxiosError<ErrorResponse>(err)) {
    // The request was made and the server response with a status code
    if (err.response) {
      const error = new ServerError(
        err.response.data.message,
        err.response.status,
        err.response.data.details
      );
      error.cause = err;
      return error;
    }

    // The request was made but no response was received
    if (err.request) {
      const error = new ClientError(
        "Something went wrong. Please try again later.",
        "No response was received"
      );
      error.cause = error;
      return error;
    }
  }

  // Some other error
  if (err instanceof Error) {
    const error = new AppError(err.message);
    error.cause = err;
    return error;
  }

  const error = new AppError("An unknown error occurred");
  error.cause = err;
  return error;
}

function handleError(error: AppError): AppError {

  if (error instanceof ServerError && error.statusCode === 401) {
    store.dispatch(unauthenticate())
  }

 return error;
}

export function errWrapper<T>(fn: () => Promise<T>): () => Promise<T>;
export function errWrapper<T, A>(fn: (arg: A) => Promise<T>): (arg: A) => Promise<T>;
export function errWrapper<T, A>(fn: ((arg?: A) => Promise<T>) | (() => Promise<T>)): ((arg?: A) => Promise<T>) | (() => Promise<T>) {
  return async (arg?: A) => {
    try {
      return await fn(arg);
    } catch (err) {
      const appError =  standardiseError(err);
      throw handleError(appError);
      
    }
  };
}