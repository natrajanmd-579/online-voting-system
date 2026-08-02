// Parses page/limit query params into a safe { page, limit, offset } triple.
function getPagination(query, defaults = { page: 1, limit: 10, maxLimit: 100 }) {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (!Number.isInteger(page) || page < 1) page = defaults.page;
    if (!Number.isInteger(limit) || limit < 1) limit = defaults.limit;
    if (limit > defaults.maxLimit) limit = defaults.maxLimit;

    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function buildMeta({ page, limit, total }) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
}

module.exports = { getPagination, buildMeta };
