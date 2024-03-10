import { useMutation } from "@tanstack/react-query";
import staffService from "../../services/auth";
import { useAppDispatch } from "../../redux/hooks";
import { unauthenticate } from "../../redux/auth-reducer";
import { AppError } from "../../types/app-error";
import { useState } from "react";
import { errorInterceptor } from "../../lib/error";

export function useLogout({
  onError,
  onSuccess,
}: { onError?: (err: AppError) => void; onSuccess?: () => void } = {}) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<AppError | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: staffService.logout,
    onSuccess: () => {
      setError(null);
      dispatch(unauthenticate());
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err) => errorInterceptor(err, (err) => {
      setError(err);
      if (onError) {
        onError(err);
      }
    
    })
  });

  return { logout: mutate, isPending, error };
}
