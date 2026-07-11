import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));
        return ApiResponse.error(res, {
            message: 'Validation failed',
            statusCode: 422,
            errors: extractedErrors,
        });
    }
    next();
};

export default validate;
