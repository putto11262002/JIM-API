import { useQueryClient, useMutation, QueryKey } from "@tanstack/react-query";
import useNotification from "../../hooks/use-notification";
import AppError from "../../types/app-error";
import { errWrapper } from "../error";


type NotifySuccess = { notify: false } | { notify: true, message: string} | string ;

type NotificationError = { notify: false } | { notify: true, message?: string} | string | boolean;


export type UseAppMutationProps<T, A,> = {
  mutationFn: ((arg: A) => Promise<T>) | (() => Promise<T>) | ((arg?: A) => Promise<T>);
  invalidateQueryKeys?: QueryKey[];
  notifyError?: NotificationError
  notifySuccess?: NotifySuccess
  onSuccess?: ((data: T, variables: A, context: unknown) => unknown) | undefined
  onError?: ((error: AppError, variables: A, context: unknown) => unknown) | undefined
}

export default function useAppMutation<T, A>({
  mutationFn,
  invalidateQueryKeys,
  notifyError =  true,
  notifySuccess = {notify: false},
  onSuccess,
  onError,
}: UseAppMutationProps<T, A>) {
  const { error: _error, success } = useNotification();
  const queryClient = useQueryClient();


  const { mutate, status, error, data } = useMutation<T, AppError, A, {errorHandled: boolean}>({
    mutationFn: async (arg: A) => errWrapper(mutationFn)(arg)
    ,
    onSuccess: (data, variables, context) => {
      if (invalidateQueryKeys) {
        invalidateQueryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (typeof notifySuccess === "object" && "notify" in notifySuccess) {
        if (notifySuccess.notify){
          success(notifySuccess.message)
        }else if (typeof notifySuccess === "string") {
          success(notifySuccess);
        }

      }
      onSuccess && onSuccess(data, variables, context);
    },
    onError: (err, variables, context) => {
      if (typeof notifyError === "object" && "notify" in notifyError) {
        if (notifyError.notify) {
          _error(notifyError.message ?  notifyError.message : err.message);
        } else if (typeof notifyError === "string") {
          _error(notifyError);
        }else if (typeof notifyError === "boolean" && notifyError) {
          _error(err.message);
        }
      }
      onError && onError(err, variables, context);
      
      
    },
  });
  return { mutate, status, error, data };
}

