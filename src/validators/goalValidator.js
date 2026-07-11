import { body, param, query } from 'express-validator';

export const createGoalValidator = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('category').optional().isIn(['ACADEMIC', 'SKILL', 'BEHAVIOR', 'CUSTOM']),
    body('subject').optional().trim(),
    body('targetDate').optional().isISO8601(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('milestones').optional().isArray(),
    body('milestones.*.title').optional().trim(),
];

export const updateGoalValidator = [
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('targetDate').optional().isISO8601(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED']),
    body('progress').optional().isInt({ min: 0, max: 100 }),
];

export const goalIdValidator = [
    param('id').isMongoId().withMessage('Invalid goal ID'),
];

export const goalQueryValidator = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('status').optional().isString(),
    query('studentId').optional().isMongoId(),
];
