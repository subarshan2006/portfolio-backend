import { param, query } from 'express-validator';

export const notificationIdValidator = [
    param('id').isMongoId().withMessage('Invalid notification ID'),
];

export const notificationQueryValidator = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('isRead').optional().isIn(['true', 'false']),
    query('type').optional().isString(),
    query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
];
