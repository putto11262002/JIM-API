export type PaginatedData<T> = {
    data: T[];
    total: number;
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
