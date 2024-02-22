export interface PaginationOptions {
    page?: number;
    take?: number;
    skip?: number;
}

export interface PaginationResponse<K> extends PaginationOptions {
    total: number;
    totalPages: number;
    data: K[];
}
