import express from "express";
import bcrypt from "bcrypt";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWTPayload } from "../types/jwt";
import AuthenticationError from "./errors/authentication-error";

/**
 * Hashes the provided password.
 * 
 * @param password - The password to be hashed.
 * @param saltRounds - Optional parameter specifying the number of salt rounds for hashing. If not provided, the default value from configuration is used.
 * @returns The hashed password.
 */

export async function hash(password: string, saltRounds?: number ): Promise<string> {
  if (!saltRounds) {
    saltRounds = config.SALT_ROUNDS
  }
  const hashed = await bcrypt.hash(password, saltRounds)
  return hashed
  
}

/**
 * Compares a password with its corresponding hash using bcrypt's comparison function.
 * 
 * @param password - The password to be compared.
 * @param hash - The hash to compare the password against.
 * @returns A Promise resolving to true if the password matches the hash, false otherwise.
 */
export async function compare(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Signs a JSON Web Token (JWT) with the provided payload, secret, and optional options.
 * 
 * @param payload - The payload to be included in the JWT.
 * @param secret - The secret key used for signing the JWT.
 * @param options - Optional signing options for the JWT.
 * @returns A signed JWT string.
 */
export function signToken<T extends Record<string, any>>(payload: T, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options)
}

/**
 * Signs an access token with the provided payload using the configured JWT secret and access token expiration time.
 * 
 * @param payload - The payload to be included in the access token.
 * @returns A signed access token string.
 */
export function signAccessToken(payload: JWTPayload): string {
  return signToken(payload, config.JWT_SECRET, {expiresIn: config.ACCESS_TOKEN_EXPIRATION})
}

/**
 * Signs a refresh token with the provided payload using the configured JWT secret and refresh token expiration time.
 * 
 * @param payload - The payload to be included in the refresh token.
 * @returns A signed refresh token string.
 */
export function signRefreshToken(payload: JWTPayload): string {
  return signToken(payload, config.JWT_SECRET, {expiresIn: config.REFRESH_TOKEN_EXPIRATION})
}

/**
 * Verifies the authenticity of a JSON Web Token (JWT) using the provided token and secret key.
 * 
 * @param token - The JWT to be verified.
 * @param secret - The secret key used for verifying the JWT signature.
 * @returns The payload contained within the verified JWT.
 * @throws AuthenticationError if the token is invalid or expired.
 */
export function verifyToken<T extends jwt.JwtPayload>(token: string, secret: string): T  {
  try{
    const payload = jwt.verify(token, secret,)
    return payload as T
  }catch(err){
    if (err instanceof jwt.TokenExpiredError){
      throw new AuthenticationError("Token expired")
    }

    if (err instanceof jwt.JsonWebTokenError){
      throw new AuthenticationError("Invalid token")
    }

    throw err
  }
}



/**
 * Verifies the authenticity of an access token using the configured JWT secret.
 * 
 * @param token - The access token to be verified.
 * @returns The payload contained within the verified access token.
 * @throws AuthenticationError if the access token is invalid or expired.
 */
export function verifyAccessToken(token: string): JWTPayload {
  return verifyToken(token, config.JWT_SECRET) as JWTPayload  
}

/**
 * Verifies the authenticity of a refresh token using the configured JWT secret.
 * 
 * @param token - The refresh token to be verified.
 * @returns The payload contained within the verified refresh token.
 * @throws AuthenticationError if the refresh token is invalid or expired.
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return verifyToken(token, config.JWT_SECRET) as JWTPayload
}