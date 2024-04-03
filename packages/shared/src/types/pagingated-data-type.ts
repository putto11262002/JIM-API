export type PaginatedData<T> = {
    data: T[];
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export const OrderDir = {
    ASC: "asc",
    DESC: "desc"
} as const;

export type OrderDir = typeof OrderDir[keyof typeof OrderDir];


export type PaginatedDataQuery<T> = {
    page?: number;
    pageSize?: number;
    orderBy?: T
    orderDir?: OrderDir;
}
