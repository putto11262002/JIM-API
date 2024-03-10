import {
  PaginatedData,
  StaffCreateInput,
  StaffGetQuery,
  StaffLoginInput,
  StaffLoginResult,
  StaffUpdateInput,
  StaffWithoutSecrets,
} from "@jimmodel/shared";

import axiosClient, { axiosClientWithToken } from "../lib/axios";
import { GenericAbortSignal } from "axios";

async function create(payload: StaffCreateInput) {
  const response = await axiosClient.post("/staffs", payload);
  return response.data as StaffWithoutSecrets;
}


async function login(payload: StaffLoginInput) {
  const response = await axiosClientWithToken.post("/staffs/login", payload);
  const loginResult = response.data as StaffLoginResult;
  setRefreshToken(loginResult.refreshToken);
  setAccessToken(loginResult.accessToken);

  return loginResult;
}

async function refreshToken() {
  const token = localStorage.getItem("refreshToken");

  if (token === undefined || token === null) {
    throw new Error("No refresh token");
  }
  const res = await axiosClientWithToken.post("/staffs/refresh-token", { token });
  const result = res.data as StaffLoginResult;

  setRefreshToken(result.refreshToken);
  setAccessToken(result.accessToken);

  return result;
}

async function logout() {
  await axiosClient.post("staffs/logout");
  clearAccessToken()
  clearRefreshToken()
  
}

async function getAll(query: StaffGetQuery, signal: GenericAbortSignal){
  const res = await axiosClient.get("/staffs", {
    params: {...query, roles: query.roles?.join(",")},
    signal
  });
  return res.data as PaginatedData<StaffWithoutSecrets>
}


async function updateById(id: string, payload: StaffUpdateInput) {
  await axiosClient.put(`/staffs/${id}`, payload);
}

function setAccessToken(token: string) { 
  return localStorage.setItem("accessToken", token);
}

function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

function setRefreshToken(token: string) {
  return localStorage.setItem("refreshToken", token);
}

function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}

function clearAccessToken(){
  localStorage.removeItem("accessToken")
}

function clearRefreshToken(){
  localStorage.removeItem("refreshToken")
}


const staffService = {
  login,
  refreshToken,
  logout,
  getAccessToken,
  getRefreshToken,
  create,
  updateById,
  clearAccessToken,
  clearRefreshToken,
  getAll
};


export default staffService;
