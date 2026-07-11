import { body, param, query } from 'express-validator';

export const createHomeworkValidator = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('subject').optional().trim(),
    body('chapter').optional().trim(),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('totalMarks').optional().isInt({ min: 0 }),
];

export const updateHomeworkValidator = [
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ max: 200 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('dueDate').optional().isISO8601(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('status').optional().isIn(['ASSIGNED', 'SUBMITTED', 'PENDING', 'OVERDUE', 'EXCUSED', 'GRADED']),
];

export const homeworkIdValidator = [
    param('id').isMongoId().withMessage('Invalid homework ID'),
];

export const homeworkQueryValidator = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('status').optional().isString(),
    query('studentId').optional().isMongoId(),
];
