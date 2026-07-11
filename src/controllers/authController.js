import asyncHandler from '../middleware/asyncHandler.js';
import * as authService from '../services/authService.js';
import ApiResponse from '../utils/apiResponse.js';
import env from '../config/env.js';

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const tutor = await authService.registerTutor({ name, email, password });
    return ApiResponse.created(res, { data: tutor, message: 'Registration successful' });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginTutor(email, password);

    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    return ApiResponse.success(res, {
        data: {
            accessToken: result.accessToken,
            tutor: result.tutor,
        },
        message: 'Login successful',
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return ApiResponse.error(res, { message: 'No refresh token provided', statusCode: 401 });
    }

    const result = await authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    return ApiResponse.success(res, {
        data: { accessToken: result.accessToken },
        message: 'Token refreshed',
    });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    await authService.logoutTutor(req.tutorId, refreshToken);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return ApiResponse.success(res, { message: 'Logout successful' });
});

export const getMe = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, {
        data: {
            id: req.tutor._id,
            name: req.tutor.name,
            email: req.tutor.email,
            phone: req.tutor.phone,
            profilePhoto: req.tutor.profilePhoto,
            settings: req.tutor.settings,
            createdAt: req.tutor.createdAt,
        },
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const tutor = await authService.updateTutorProfile(req.tutorId, req.body);
    return ApiResponse.success(res, {
        data: {
            id: tutor._id,
            name: tutor.name,
            email: tutor.email,
            phone: tutor.phone,
            profilePhoto: tutor.profilePhoto,
        },
        message: 'Profile updated successfully',
    });
});

export const updateSettings = asyncHandler(async (req, res) => {
    const tutor = await authService.updateTutorSettings(req.tutorId, req.body);
    return ApiResponse.success(res, {
        data: { settings: tutor.settings },
        message: 'Settings updated successfully',
    });
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.tutorId, currentPassword, newPassword);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return ApiResponse.success(res, { message: 'Password changed successfully. Please login again.' });
});
