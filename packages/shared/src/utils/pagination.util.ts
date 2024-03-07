import { PaginationOptions, PaginationResponse } from 'core/interfaces';

export function getPaginationMetadata(paginationOptions: PaginationOptions) {
    const page = Number(paginationOptions.page) || 1;
    const take = Number(paginationOptions.take) || 5;
    const skip = (page - 1) * take;
    return {
        page,
        take,
        skip,
    };
}

export function getPaginationResponse<K>(
    data: K[],
    metadata: Required<PaginationOptions> & { total: number }
): PaginationResponse<K> {
    const { page, take, total } = metadata;
    return {
        page,
        take,
        data,
        total: metadata.total,
        totalPages: Math.ceil(total / take!),
    };
}
