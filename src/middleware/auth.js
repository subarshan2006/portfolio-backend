import { verifyAccessToken } from '../utils/jwtUtils.js';
import { findTutorById } from '../services/authService.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

const authenticate = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw ApiError.unauthorized('Access denied. No token provided.');
        }

        const decoded = verifyAccessToken(token);

        const tutor = await findTutorById(decoded.id);
        if (!tutor) {
            throw ApiError.unauthorized('Tutor no longer exists.');
        }

        req.tutor = tutor;
        req.tutorId = tutor._id;
        next();
    } catch (error) {
        if (error.isOperational) {
            return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode });
        }
        return ApiResponse.error(res, { message: 'Invalid or expired token', statusCode: 401 });
    }
};

export default authenticate;
