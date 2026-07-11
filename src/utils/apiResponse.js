class ApiResponse {
    static success(res, { data = null, message = 'Success', statusCode = 200, meta = null } = {}) {
        const response = {
            success: true,
            message,
            ...(data !== null && { data }),
            ...(meta && { meta }),
        };
        return res.status(statusCode).json(response);
    }

    static created(res, { data = null, message = 'Created successfully' } = {}) {
        return this.success(res, { data, message, statusCode: 201 });
    }

    static noContent(res) {
        return res.status(204).send();
    }

    static error(res, { message = 'Error', statusCode = 500, errors = null } = {}) {
        const response = {
            success: false,
            message,
            ...(errors && { errors }),
        };
        return res.status(statusCode).json(response);
    }

    static paginated(res, { data, page, limit, total, message = 'Success' } = {}) {
        const totalPages = Math.ceil(total / limit);
        return this.success(res, {
            data,
            message,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
}

export default ApiResponse;
