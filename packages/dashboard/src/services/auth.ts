import {
  StaffLoginDTO,
  StaffLoginResponseDTO,
  ErrorResponse,
  ApiResponse,
  StaffRefreshTokenResponseDTO,
} from "@jimmodel/shared";
import axios from "axios";
import { AppError, AppErrorType } from "../types/app-error";
import axiosClient from "../lib/axios";

const axiosClientWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export class StaffAuthService {
  public static async login(payload: StaffLoginDTO) {
    const response = await axiosClientWithToken.post("/staffs/login", payload);
    const loginResult = response.data as ApiResponse<StaffLoginResponseDTO>;
    localStorage.setItem("refreshToken", loginResult.data.refreshToken);
    localStorage.setItem("accessToken", loginResult.data.accessToken);

    return loginResult;
  }

  public static async refreshToken() {
    const token = localStorage.getItem("refreshToken");
    const res = await axiosClientWithToken.post("/staffs/refresh", { token });
    const result = res.data as ApiResponse<StaffRefreshTokenResponseDTO>;

    localStorage.setItem("refreshToken", result.data.refreshToken);
    localStorage.setItem("accessToken", result.data.accessToken);

    return result;
  }


  public static setAccessToken(token: string) { 
    return localStorage.setItem("accessToken", token);
  }

  public static getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  public static setRefreshToken(token: string) {
    return localStorage.setItem("refreshToken", token);
  }

  public static getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  public static clearAccessToken(){
    localStorage.removeItem("accessToken")
  }

  public static clearRefreshToken(){
    localStorage.removeItem("refreshToken")
  }

  public static async logout() {
    await axiosClient.post("staffs/logout");
    this.clearAccessToken()
    this.clearRefreshToken()
    
  }

  public static handleError(err: unknown): AppError {
    let error: AppError;
    if (axios.isAxiosError<ErrorResponse>(err) && err.response) {
      error = {
        details: err.response.data.details,
        message: err.response.data.message,
        statusCode: err.response.status,
        type: err.response.status === 401 ? AppErrorType.AUTH_ERROR : AppErrorType.SERVER_ERROR
      }
    } else if (axios.isAxiosError<ErrorResponse>(err) && err.request) {
      error = {
        details: "An unknown error occurred with axios",
        message: "Something went wrong. Please try again later",
        type: AppErrorType.CLIENT_ERROR,
        
      };
    } else {
      error = {
        details: "An unknown error occurred on the client",
        message: "Something went wrong. Please try again later",
        type: AppErrorType.CLIENT_ERROR,
      };
    }
    return error;
  }
}
