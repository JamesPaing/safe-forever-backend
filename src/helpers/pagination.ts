export const parsePagination = (req: any, _: any, next: any) => {
    let { page, limit } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!page || page <= 0) page = 1;
    if (!limit || limit <= 0) limit = 10;

    const offset = (page - 1) * limit;

    req.pagination = { page, limit, offset };

    next();
};

export function validateMaxNumber(number: number, max: number) {
    if (number < 0) {
        return 0;
    }
    if (number < max) {
        return number;
    }

    return max;
}

export const buildPaginator = (
    total: number,
    offset: number,
    limit: number
) => {
    const currentPage = offset / limit + 1;
    const totalPages = Math.ceil(total / limit);
    const itemFrom = validateMaxNumber((currentPage - 1) * limit + 1, total);
    const itemTo = validateMaxNumber(currentPage * limit, total);

    return {
        totalItems: total,
        totalPages,
        itemFrom,
        itemTo,
        currentPage,
        limit,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
    };
};
