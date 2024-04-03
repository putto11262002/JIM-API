import staffService from "../../services/auth";
import { useAppDispatch } from "../../redux/hooks";
import { authenticate, unauthenticate } from "../../redux/auth-reducer";
import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import ServerError from "../../types/server-error";

export function useRefreshToken() {
  const dispatch = useAppDispatch();
  const { mutate, status } = useAppMutation({
    mutationFn: staffService.refreshToken,
    onSuccess: (data) => {
      dispatch(authenticate(data.staff));
    },
    onError: (error) => {
      if (error instanceof ServerError && error.statusCode === 401) {
        dispatch(unauthenticate());
      }
    }
  });

  return { refreshToken: mutate, status };
}