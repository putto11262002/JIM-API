import { StaffResponseDTO, StaffWithoutPassword } from "@jimmodel/shared";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { RootState } from "./store";
import { AppError } from "../types/app-error";


export enum AuthStatus {
    LOADING = "loading",
    FAILED = "failed",
    SUCCESS = "success"
}
export type AuthState = {
    isLogin: boolean;
    staff: StaffResponseDTO | null
    status: AuthStatus
    error: AppError | null
} 

const initialState: AuthState = {
    isLogin: false,
    staff: null,
    status: AuthStatus.LOADING,
    error: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loggingIn: (state) => {
            state.isLogin = false;
            state.status = AuthStatus.LOADING
            state.error = null;
            state.staff = null;
        },
        loginSuccess: (state, action: PayloadAction<StaffWithoutPassword>) => {
            state.isLogin = true;
            state.staff = action.payload;
            state.status = AuthStatus.SUCCESS
            state.error = null;
        },
        loginFail: (state, action: PayloadAction<AppError>) => {
            state.error = action.payload;
            state.status = AuthStatus.FAILED
            state.isLogin = false;
            state.staff = null;
        },
        loggingOut: (state) => {
            state.status = AuthStatus.LOADING
            state.error = null;
        },
        logoutSuccess: (state) => {
           state.isLogin = false;
           state.error = null;
           state.staff = null;
           state.status = AuthStatus.SUCCESS
        },
        logoutFail: (state, action: PayloadAction<AppError>) => {
            state.error = action.payload;
            state.status = AuthStatus.FAILED
            state.isLogin = false;
            state.staff = null;
        },
       
    }
})

export const {loggingIn, loginSuccess, loginFail, loggingOut, logoutFail, logoutSuccess} = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

const authReducer = authSlice.reducer
export default authReducer