export type PaginatedData<T> = {
    data: T[];
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
