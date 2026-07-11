import Tutor from '../models/Tutor.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils.js';
import ApiError from '../utils/apiError.js';
import env from '../config/env.js';

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const registerTutor = async (data) => {
    const { name, email, password } = data;

    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
        throw ApiError.conflict('A tutor with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    const tutor = await Tutor.create({
        name,
        email,
        passwordHash,
    });

    return {
        id: tutor._id,
        name: tutor.name,
        email: tutor.email,
    };
};

export const loginTutor = async (email, password) => {
    const tutor = await Tutor.findOne({ email }).select('+passwordHash');
    if (!tutor) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await comparePassword(password, tutor.passwordHash);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const payload = { id: tutor._id, email: tutor.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    tutor.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date(),
        expiresAt,
    });

    // Keep only last 5 refresh tokens
    if (tutor.refreshTokens.length > 5) {
        tutor.refreshTokens = tutor.refreshTokens.slice(-5);
    }

    tutor.lastLoginAt = new Date();
    await tutor.save();

    return {
        accessToken,
        refreshToken,
        tutor: {
            id: tutor._id,
            name: tutor.name,
            email: tutor.email,
        },
    };
};

export const refreshTokens = async (refreshToken) => {
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch {
        throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const tutor = await Tutor.findById(decoded.id).select('+refreshTokens');
    if (!tutor) {
        throw ApiError.unauthorized('Tutor not found');
    }

    const tokenIndex = tutor.refreshTokens.findIndex((t) => t.token === refreshToken);
    if (tokenIndex === -1) {
        // Refresh token reuse detected - revoke all tokens
        tutor.refreshTokens = [];
        await tutor.save();
        throw ApiError.unauthorized('Refresh token has been reused. All sessions revoked.');
    }

    // Remove the used refresh token
    tutor.refreshTokens.splice(tokenIndex, 1);

    // Generate new tokens
    const payload = { id: tutor._id, email: tutor.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    tutor.refreshTokens.push({
        token: newRefreshToken,
        createdAt: new Date(),
        expiresAt,
    });

    await tutor.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

export const logoutTutor = async (tutorId, refreshToken) => {
    const tutor = await Tutor.findById(tutorId).select('+refreshTokens');
    if (!tutor) return;

    if (refreshToken) {
        tutor.refreshTokens = tutor.refreshTokens.filter((t) => t.token !== refreshToken);
    } else {
        tutor.refreshTokens = [];
    }
    await tutor.save();
};

export const findTutorById = async (id) => {
    return Tutor.findById(id);
};

export const updateTutorProfile = async (tutorId, data) => {
    const allowedFields = ['name', 'phone', 'profilePhoto'];
    const updates = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    const tutor = await Tutor.findByIdAndUpdate(tutorId, updates, { new: true, runValidators: true });
    if (!tutor) {
        throw ApiError.notFound('Tutor not found');
    }
    return tutor;
};

export const updateTutorSettings = async (tutorId, settings) => {
    const tutor = await Tutor.findByIdAndUpdate(
        tutorId,
        { $set: { settings } },
        { new: true, runValidators: true }
    );
    if (!tutor) {
        throw ApiError.notFound('Tutor not found');
    }
    return tutor;
};

export const changePassword = async (tutorId, currentPassword, newPassword) => {
    const tutor = await Tutor.findById(tutorId).select('+passwordHash');
    if (!tutor) {
        throw ApiError.notFound('Tutor not found');
    }

    const isMatch = await comparePassword(currentPassword, tutor.passwordHash);
    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    tutor.passwordHash = await hashPassword(newPassword);
    tutor.refreshTokens = []; // Revoke all other sessions
    await tutor.save();

    return true;
};

export const getTutorProfile = async (tutorId) => {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
        throw ApiError.notFound('Tutor not found');
    }
    return tutor;
};
