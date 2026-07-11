import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many email requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
