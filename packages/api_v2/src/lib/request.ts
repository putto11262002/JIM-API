import express from "express";
import { z } from "zod";
import ValidationError, { zodErrorToValidationError } from "./errors/validation-error";

/**
 * Extracts single files from the request based on the provided fieldname.
 * 
 * @param req - The express request object.
 * @param fieldname - The name of the field from which to extract the file.
 * @returns The extracted file from the request, or throws an error if no file is found.
 * @throws Error if no file is found in the request.
 */

export function extractSingleFilesFromRequest(
  req: express.Request,
  fieldname: string
): Express.Multer.File {
  const file = req.file;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files && !file) {
    throw new ValidationError("No file in the request");
  }

  const targetField = file || files[fieldname];

  const targetFile =  Array.isArray(targetField) ? targetField[0] : targetField;

 
  if (file === null) {
    throw new ValidationError("No file in the request");
  }
  return targetFile
}


export function extractFileFromRequest(req: express.Request, fieldname: string): Express.Multer.File | Express.Multer.File[] {
  const file = req.file;
  const files = req.files

  if (!files && !file) {
    throw new ValidationError("No file in the request");
  }

  const targetFile = file || (Array.isArray(files) ? files : files?.[fieldname])

 
  if (targetFile === undefined) {
    throw new ValidationError("No file in the request");
  }
  return targetFile
}


/**
 * Extracts the token from the request's authorization header.
 * 
 * @param req - The express request object.
 * @returns The token extracted from the authorization header, or null if no token is found.
 */
export function getTokenFromRequest(req: express.Request){
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")?.[1] || null;
  return token;
}



