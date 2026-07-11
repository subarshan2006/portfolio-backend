export const buildPaginationQuery = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

export const buildSortQuery = (sortBy = 'createdAt', order = 'desc') => {
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;
    return sort;
};
