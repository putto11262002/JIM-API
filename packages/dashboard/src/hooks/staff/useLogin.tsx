import { useMutation } from "@tanstack/react-query";
import { getAppError } from "../../lib/error";
import { StaffLoginResult } from "@jimmodel/shared";
import { AppError } from "../../types/app-error";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { authenticate } from "../../redux/auth-reducer";
import staffService from "../../services/auth";

export function useLogin({
  onError,
  onSuccess,
}: {
  onSuccess?: (loginResult: StaffLoginResult) => void;
  onError?: (err: AppError) => void;
} = {}) {
  const [error, setError] = useState<AppError | null>(null);
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useMutation({
    mutationFn: staffService.login,
    onSuccess: (loginResult) => {
      setError(null);
      // Save the staff to redux store
      dispatch(authenticate(loginResult.staff));

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(loginResult);
      }
    },
    onError: (err) => {
      const appError = getAppError(err);
      setError(appError);
      if (onError) {
        onError(appError);
      }
    },
  });

  return { login: mutate, isPending, error };
}
