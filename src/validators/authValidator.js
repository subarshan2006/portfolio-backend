import { body } from 'express-validator';

export const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase, one lowercase, and one number'),
];

export const loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one uppercase, one lowercase, and one number'),
];

export const updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('phone')
        .optional()
        .trim()
        .isMobilePhone().withMessage('Please provide a valid phone number'),
];

export const updateSettingsValidator = [
    body('timezone')
        .optional()
        .isString().withMessage('Timezone must be a string'),
    body('emailNotifications')
        .optional()
        .isBoolean().withMessage('Email notifications must be a boolean'),
    body('sessionReminderMinutes')
        .optional()
        .isInt({ min: 5, max: 120 }).withMessage('Session reminder minutes must be between 5 and 120'),
    body('feeReminderDayOfMonth')
        .optional()
        .isInt({ min: 1, max: 28 }).withMessage('Fee reminder day must be between 1 and 28'),
    body('workingDays')
        .optional()
        .isArray().withMessage('Working days must be an array'),
    body('workingHours')
        .optional()
        .isObject().withMessage('Working hours must be an object'),
];
