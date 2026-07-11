import ApiResponse from '../utils/apiResponse.js';
import env from '../config/env.js';

const errorHandler = (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('Error:', {
        message: err.message,
        stack: env.nodeEnv === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = { statusCode: 400, message: 'Invalid ID format' };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = { statusCode: 409, message: `Duplicate value for field: ${field}` };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        error = { statusCode: 422, message: 'Validation error', errors: messages };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = { statusCode: 401, message: 'Invalid token' };
    }

    if (err.name === 'TokenExpiredError') {
        error = { statusCode: 401, message: 'Token expired' };
    }

    return ApiResponse.error(res, {
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || 500,
        errors: error.errors || null,
    });
};

export default errorHandler;
