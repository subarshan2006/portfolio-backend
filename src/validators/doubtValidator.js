import { body, param, query } from 'express-validator';

export const createDoubtValidator = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('question').trim().notEmpty().withMessage('Question is required').isLength({ max: 3000 }),
    body('topic').optional().trim(),
    body('subject').optional().trim(),
    body('sessionId').optional().isMongoId(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
];

export const updateDoubtValidator = [
    param('id').isMongoId(),
    body('question').optional().trim().isLength({ max: 3000 }),
    body('topic').optional().trim(),
    body('status').optional().isIn(['OPEN', 'ANSWERED', 'PENDING_REVIEW', 'RESOLVED']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
];

export const doubtIdValidator = [
    param('id').isMongoId().withMessage('Invalid doubt ID'),
];

export const doubtQueryValidator = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('status').optional().isString(),
    query('studentId').optional().isMongoId(),
    query('topic').optional().isString(),
];
