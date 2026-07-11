import { body, param, query } from 'express-validator';

export const createSessionValidator = [
    body('studentId').notEmpty().withMessage('Student ID is required').isMongoId().withMessage('Invalid student ID'),
    body('date').notEmpty().withMessage('Session date is required').isISO8601().withMessage('Invalid date format'),
    body('startTime').notEmpty().withMessage('Start time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),
    body('endTime').notEmpty().withMessage('End time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format'),
    body('duration').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    body('topicPlanned').optional().trim(),
    body('topicCompleted').optional().trim(),
    body('homeworkGiven').optional().trim(),
    body('personalNotes').optional().trim(),
    body('preparationNotes').optional().trim(),
    body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
    body('recurringPattern').optional().isObject().withMessage('recurringPattern must be an object'),
    body('recurringPattern.frequency').optional().isIn(['WEEKLY', 'BIWEEKLY', 'MONTHLY']).withMessage('Invalid frequency'),
    body('recurringPattern.endDate').optional().isISO8601().withMessage('Invalid end date'),
];

export const updateSessionValidator = [
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('startTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),
    body('endTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format'),
    body('duration').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    body('topicPlanned').optional().trim(),
    body('topicCompleted').optional().trim(),
    body('homeworkGiven').optional().trim(),
    body('personalNotes').optional().trim(),
];

export const statusValidator = [
    body('status').notEmpty().withMessage('Status is required')
        .isIn(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', 'RESCHEDULED']).withMessage('Invalid status'),
];

export const attendanceValidator = [
    body('attendance').notEmpty().withMessage('Attendance is required')
        .isIn(['PRESENT', 'ABSENT', 'CANCELLED', 'LATE']).withMessage('Invalid attendance status'),
];

export const rescheduleValidator = [
    body('date').notEmpty().withMessage('New date is required').isISO8601().withMessage('Invalid date format'),
    body('startTime').notEmpty().withMessage('New start time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),
    body('endTime').notEmpty().withMessage('New end time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format'),
];

export const sessionIdValidator = [
    param('id').isMongoId().withMessage('Invalid session ID'),
];

export const sessionQueryValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
];
