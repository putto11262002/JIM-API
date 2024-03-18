import { PaginatedData } from "@jimmodel/shared";

export function buildPaginatedData<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedData<T> {
  return {
    data,
    page,
    pageSize,
    total,
    totalPage: Math.ceil(total / pageSize),
    hasNextPage: page * pageSize < total,
    hasPreviousPage: page > 1,
  };
}
