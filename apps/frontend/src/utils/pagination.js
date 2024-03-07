import { getURLParams } from './http';

export const getPaginationURLParams = (pagination) =>
    getURLParams({
        page: pagination.pageIndex + 1,
        take: pagination.pageSize,
    });
