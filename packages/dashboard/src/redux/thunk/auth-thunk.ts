import { StaffLoginDTO } from "@jimmodel/shared";
import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  loggingIn,
  loggingOut,
  loginFail,
  loginSuccess,
  logoutFail,
  logoutSuccess,
} from "../auth-reducer";
import { StaffAuthService } from "../../services/auth";
import { errorParser } from "../../lib/error-parser";

export function loginThunk(
  loginPayload: StaffLoginDTO
): ThunkAction<void, RootState, unknown, UnknownAction> {
  return async function (dispatch) {
    dispatch(loggingIn());
    try {
      const res = await StaffAuthService.login(loginPayload);
      dispatch(loginSuccess(res.data.staff));
    } catch (err) {
      const appError = errorParser(err);
      dispatch(loginFail(appError));
    }
  };
}

export function logoutThunk(): ThunkAction<
  void,
  RootState,
  unknown,
  UnknownAction
> {
  return async function (dispatch, getState) {
    const state = getState();
    if (!state.auth.isLogin) {
      return;
    }
    dispatch(loggingOut());
    try {
      await StaffAuthService.logout();
      dispatch(logoutSuccess());
    } catch (err) {
      const appError = errorParser(err);
      dispatch(logoutFail(appError));
    }
  };
}

export function refreshTokenThunk(): ThunkAction<
  void,
  RootState,
  unknown,
  UnknownAction
> {
  return async function (dispatch) {
    try {
      const res = await StaffAuthService.refreshToken();
      dispatch(loginSuccess(res.data.staff));
    } catch (err) {
      const appError = errorParser(err);
      console.debug(appError);
      dispatch(logoutSuccess());
    }
  };
}
