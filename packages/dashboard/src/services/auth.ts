import {
  StaffLoginDTO,
  ApiResponse,
  StaffLoginResult,
  StaffRefreshTokenResult,
} from "@jimmodel/shared";
import axios from "axios";
import axiosClient from "../lib/axios";

const axiosClientWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export class StaffAuthService {
  public static async login(payload: StaffLoginDTO) {
    const response = await axiosClientWithToken.post("/staffs/login", payload);
    const loginResult = response.data as ApiResponse<StaffLoginResult>;
    localStorage.setItem("refreshToken", loginResult.data.refreshToken);
    localStorage.setItem("accessToken", loginResult.data.accessToken);

    return loginResult;
  }

  public static async refreshToken() {
    const token = localStorage.getItem("refreshToken");
    const res = await axiosClientWithToken.post("/staffs/refresh", { token });
    const result = res.data as ApiResponse<StaffRefreshTokenResult>;

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

}
