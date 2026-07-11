import { body, param, query } from 'express-validator';

export const createStudentValidator = [
    body('name').trim().notEmpty().withMessage('Student name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('age').optional().isInt({ min: 3, max: 25 }).withMessage('Age must be between 3 and 25'),
    body('school').optional().trim(),
    body('grade').optional().trim(),
    body('parentName').trim().notEmpty().withMessage('Parent name is required'),
    body('parentMobile').trim().notEmpty().withMessage('Parent mobile is required'),
    body('parentEmail').trim().notEmpty().withMessage('Parent email is required')
        .isEmail().withMessage('Please provide a valid parent email').normalizeEmail(),
    body('studentEmail').optional().isEmail().withMessage('Please provide a valid student email').normalizeEmail(),
    body('address').optional().trim(),
    body('subjects').optional().isArray().withMessage('Subjects must be an array'),
    body('preferredDays').optional().isArray().withMessage('Preferred days must be an array'),
    body('preferredDays.*').optional().isInt({ min: 0, max: 6 }).withMessage('Preferred days must be 0-6'),
    body('preferredTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
    body('monthlyFee').optional().isFloat({ min: 0 }).withMessage('Monthly fee must be non-negative'),
    body('status').optional().isIn(['ACTIVE', 'PAUSED', 'GRADUATED', 'DROPPED']).withMessage('Invalid status'),
    body('notes').optional().trim(),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date of birth'),
];

export const updateStudentValidator = [
    body('name').optional().trim().isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('age').optional().isInt({ min: 3, max: 25 }).withMessage('Age must be between 3 and 25'),
    body('school').optional().trim(),
    body('grade').optional().trim(),
    body('parentName').optional().trim(),
    body('parentMobile').optional().trim(),
    body('parentEmail').optional().isEmail().withMessage('Please provide a valid parent email').normalizeEmail(),
    body('studentEmail').optional().isEmail().withMessage('Please provide a valid student email').normalizeEmail(),
    body('address').optional().trim(),
    body('subjects').optional().isArray(),
    body('preferredDays').optional().isArray(),
    body('preferredDays.*').optional().isInt({ min: 0, max: 6 }),
    body('preferredTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('monthlyFee').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['ACTIVE', 'PAUSED', 'GRADUATED', 'DROPPED']),
    body('notes').optional().trim(),
    body('dateOfBirth').optional().isISO8601(),
];

export const studentIdValidator = [
    param('id').isMongoId().withMessage('Invalid student ID'),
];

export const statusValidator = [
    body('status').notEmpty().withMessage('Status is required')
        .isIn(['ACTIVE', 'PAUSED', 'GRADUATED', 'DROPPED']).withMessage('Invalid status'),
];

export const searchValidator = [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
