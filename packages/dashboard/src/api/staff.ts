import { StaffLoginInput, StaffLoginResult, StaffRefreshTokenInput } from "@jimmodel/shared";
import axiosClient, { axiosClientWithToken } from "../lib/axios";

async function login(payload: StaffLoginInput){
    const res = await axiosClientWithToken.post("/staffs/login", payload)
    const loginResult = res.data as StaffLoginResult
    return loginResult
}

async function refreshToken(payload: StaffRefreshTokenInput){
    const res = await axiosClientWithToken.post("/staffs/refresh-token", payload)
    const result = res.data as StaffLoginResult
    return result
}

async function logout(){
    await axiosClient.post("/staffs/logout")
}


const staffApi = {
    login,
    refreshToken,
    logout
}   


export default staffApi