import { QueryKey, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import AppError from "../../types/app-error";
import { errWrapper } from "../error";

type UseAppQueryProps<T, A extends { signal?: AbortSignal }> = {
  queryFn: (arg: A) => Promise<T>;
  arg: Omit<A, "query">;
  key: QueryKey;
  staleTime?: number;
  retry?: boolean;
};

export function useAppQuery<T, A extends { signal?: AbortSignal }>(
  {queryFn, key, arg = {} as A, staleTime, retry = false, enabled = true}: UseAppQueryProps<T, A> & {enabled: boolean}
) {
  const { data, status, fetchStatus, error, refetch } = useQuery<T, AppError, T>({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const wrappedQueryfn = errWrapper(queryFn);
      const result = await wrappedQueryfn({ ...arg, signal } as A);
      return result;
    },
    staleTime,
    retry,
    enabled
  });
  return { data, status, fetchStatus, error, refetch };
}

export function useAppSuspenseQuery<T, A extends { signal?: AbortSignal }>(
  {queryFn, key, arg = {} as A, staleTime, retry = false}: UseAppQueryProps<T, A>
) {
  const { data, status, fetchStatus, error } = useSuspenseQuery<T, AppError, T>({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const wrappedQueryfn = errWrapper(queryFn);
      const result = await wrappedQueryfn({ ...arg, signal } as A);
      return result;
    },
    staleTime,
    retry,
  });
  return { data, status, fetchStatus, error };
}

