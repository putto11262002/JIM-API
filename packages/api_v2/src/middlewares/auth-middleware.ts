import { StaffRole } from "@prisma/client";
import express from "express";
import { getTokenFromRequest } from "../lib/request";
import AuthenticationError from "../lib/errors/authentication-error";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AuthorizationError from "../lib/errors/authorization-error";
import { BaseAuthResource, JWTPayload } from "../types/jwt";
import NotFoundError from "../lib/errors/not-found-error";

/**
 * A function that retrieves a resource by its ID. The function should throw a NotFoundError if the resource is not found.
 * @template T - The type of the resource.
 * @param {string} id - The ID of the resource.
 * @returns {Promise<T> | T} - A promise resolving to the resource or the resource itself.
 * @throws {NotFoundError} - Thrown if the resource is not found.
 */

type GetResourceByIdFn<T extends BaseAuthResource> = (id: string) => Promise<T>;

/**
 * A function that verifies a JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {JWTPayload} - The payload of the verified JWT token.
 */
type VerifyTokenFn = (token: string) => JWTPayload;

/**
 * Middleware function for authentication and authorization. 
 * It verifies the provided JWT token and checks if the user has the required role. If no role is provided, only authentication is required.
 * @param getResourceById - Function to retrieve a resource by its ID.
 * @param  verifyTokenFn - Function to verify a JWT token.
 * @param  role - List of roles to check for authorization (optional).
 * @returns  - Express middleware function.
 */
export function authMiddleware<T extends BaseAuthResource>(
  getResourceById: GetResourceByIdFn<T>,
  verifyTokenFn: VerifyTokenFn,
  ...role: string[]
) {
  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
  try{
    const token = getTokenFromRequest(req);
    
    if (token === null) {
      throw new AuthenticationError("No token provided")
    }

    const payload = verifyTokenFn(token);

    let resource: T;

    try {
      resource = await getResourceById(payload.id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new AuthenticationError("Invalid token")
      }
      return next(err);
    }
    
    req.auth = payload;

    if (role.length === 0) {
      return next();
    }

    if (role.includes(resource.role)) {
      return next();
    }

    throw new AuthorizationError("Unauthorized")
  }catch(err){
    next(err)
  }
  }
}

