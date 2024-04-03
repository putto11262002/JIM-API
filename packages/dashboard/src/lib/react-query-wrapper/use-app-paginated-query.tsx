import { PaginatedData } from "@jimmodel/shared";
import { useState } from "react";
import { useAppQuery, useAppSuspenseQuery } from "./use-app-query";
import { QueryKey } from "@tanstack/react-query";



type PaginatedQuery = { page?: number; pageSize?: number };

type QueryFnArg<Q extends PaginatedQuery> = {
  signal?: AbortSignal;
  query?: Q;
};

type UsePaginatedQueryProps<
  T,
  A extends QueryFnArg<Q>,
  Q extends PaginatedQuery
> = {
  queryFn: (arg: A) => Promise<PaginatedData<T>>;
  initialQuery: Q;
  arg: Omit<A, "query" | "signal">;
  key: QueryKey;
};

export function useAppPaginatedQuery<
  T,
  A extends QueryFnArg<Q>,
  Q extends PaginatedQuery
>({ queryFn, initialQuery, arg, key, enabled = true }: UsePaginatedQueryProps<T, A, Q> & {enabled?: boolean}) {
  const [query, setQuery] = useState<Q & {page: number}>({ ...initialQuery, page: 1 });
  const { data, status, error, refetch } = useAppQuery<PaginatedData<T>, A>({
    queryFn,
    key: [...key, query],
    arg: { ...arg, query } as A,
    enabled
    
  });

  function nextPage() {
    if (query.page >= (data?.totalPage ?? 0)) {
      return;
    }
    setQuery(prevQuery => ({ ...prevQuery, page: prevQuery.page + 1 }));
  }

  function prevPage() {
    if (query.page <= 1) {
      return;
    }
    setQuery(prevQuery => ({ ...prevQuery, page: prevQuery.page - 1 }));
  }

  function updateQuery(newQueryCallback: (prevQuery: Q) => Q) {
    const newQuery = newQueryCallback(query);
    setQuery({ ...newQuery, page: 1 })
  }
  return {
    data: data?.data ?? [],
    status,
    nextPage,
    prevPage,
    totalPage: data?.totalPage ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    updateQuery,
    error,
    page: data?.page ?? 1,
    query,
    refetch
  };
}


export function useAppPaginatedSuspenseQuery<
  T,
  A extends QueryFnArg<Q>,
  Q extends PaginatedQuery
>({ queryFn, initialQuery, arg, key }: UsePaginatedQueryProps<T, A, Q>) {
  const [query, setQuery] = useState<Q & {page: number}>({ ...initialQuery, page: 1 });

  const { data, status, error } = useAppSuspenseQuery<PaginatedData<T>, A>({
    queryFn,
    key: [...key, query],
    arg: { ...arg, query } as A,
    
  });

  function nextPage() {
    if (query.page >= (data?.totalPage ?? 0)) {
      return;
    }
    setQuery(prevQuery => ({ ...prevQuery, page: prevQuery.page + 1 }));
  }

  function prevPage() {
    if (query.page <= 1) {
      return;
    }
    setQuery(prevQuery => ({ ...prevQuery, page: prevQuery.page - 1 }));
  }

  function updateQuery(newQueryCallback: (prevQuery: Q) => Q) {
    const newQuery = newQueryCallback(query);
    setQuery({ ...newQuery, page: 1 })
  }
  return {
    data: data?.data ?? [],
    status,
    nextPage,
    prevPage,
    totalPage: data?.totalPage ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    updateQuery,
    error,
    page: data?.page ?? 1,
    query
  };
}

