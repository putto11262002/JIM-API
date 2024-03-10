import { StaffWithoutSecrets } from "@jimmodel/shared";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { RootState } from "./store";


export enum AuthStatus {
    IDLE = "idle",
    AUTHENTICATED = "authenticated",
    UNAUTHENTICATED = "unauthenticated",
}
export type AuthState = {
    status: AuthStatus
    staff: StaffWithoutSecrets | null
} 

const initialState: AuthState = {
    staff: null,
    status: AuthStatus.IDLE,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authenticate: (state, action: PayloadAction<StaffWithoutSecrets>) => {
            state.status = AuthStatus.AUTHENTICATED
            state.staff = action.payload;
        },
        unauthenticate: (state) => {
           state.status = AuthStatus.UNAUTHENTICATED;
           state.staff = null;
        },

       
    }
})

export const {authenticate, unauthenticate} = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

const authReducer = authSlice.reducer
export default authReducer