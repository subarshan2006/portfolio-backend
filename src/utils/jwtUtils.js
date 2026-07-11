import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwtRefreshSecret);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
