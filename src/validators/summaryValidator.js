import { body, param, query } from 'express-validator';

export const createSummaryValidator = [
    param('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('topicsCovered')
        .trim()
        .notEmpty()
        .withMessage('Topics covered is required')
        .isLength({ max: 2000 })
        .withMessage('Topics covered must be under 2000 characters'),
    body('topicsPlanned')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Topics planned must be under 2000 characters'),
    body('homeworkSummary')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Homework summary must be under 2000 characters'),
    body('performanceNotes')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Performance notes must be under 2000 characters'),
    body('understandingLevel')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Understanding level must be between 1 and 5'),
    body('areasOfStrength')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Areas of strength must be under 1000 characters'),
    body('areasForImprovement')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Areas for improvement must be under 1000 characters'),
    body('nextSessionPlan')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Next session plan must be under 1000 characters'),
];

export const updateSummaryValidator = [
    param('id').isMongoId().withMessage('Invalid summary ID'),
    body('topicsCovered')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Topics covered must be under 2000 characters'),
    body('topicsPlanned')
        .optional()
        .trim()
        .isLength({ max: 2000 }),
    body('homeworkSummary')
        .optional()
        .trim()
        .isLength({ max: 2000 }),
    body('performanceNotes')
        .optional()
        .trim()
        .isLength({ max: 2000 }),
    body('understandingLevel')
        .optional()
        .isInt({ min: 1, max: 5 }),
    body('areasOfStrength')
        .optional()
        .trim()
        .isLength({ max: 1000 }),
    body('areasForImprovement')
        .optional()
        .trim()
        .isLength({ max: 1000 }),
    body('nextSessionPlan')
        .optional()
        .trim()
        .isLength({ max: 1000 }),
];

export const summaryIdValidator = [
    param('id').isMongoId().withMessage('Invalid summary ID'),
];

export const summaryQueryValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('studentId').optional().isMongoId().withMessage('Invalid student ID'),
];
