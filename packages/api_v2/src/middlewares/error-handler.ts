import express, { response } from "express";
import ApiError from "../lib/errors/api-error";
import { ErrorResponse } from "@jimmodel/shared";
import ValidationError from "../lib/errors/validation-error";

export function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    handleApiError(err, res);
  } else {
    handleInternalServerError(res);
  }
}

function handleApiError(err: ApiError, res: express.Response) {
  const response: ErrorResponse = {
    message: err.message,
    statusCode: err.code,
    details: err instanceof ValidationError ? err.details : undefined,
  };
  res.status(err.code).json(response);
}

function handleInternalServerError(res: express.Response) {
  const response: ErrorResponse = {
    message: "Internal server error",
    statusCode: 500,
  };
  res.status(500).json(response);
}