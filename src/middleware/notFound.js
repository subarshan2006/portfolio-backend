import ApiResponse from '../utils/apiResponse.js';

const notFound = (req, res) => {
    return ApiResponse.error(res, {
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        statusCode: 404,
    });
};

export default notFound;
