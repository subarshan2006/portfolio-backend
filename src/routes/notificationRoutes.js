import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { notificationIdValidator, notificationQueryValidator } from '../validators/notificationValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/unread-count', notificationController.getUnreadCount);
router.get('/', notificationQueryValidator, validate, notificationController.getNotifications);
router.get('/:id', [...notificationIdValidator], validate, notificationController.getNotificationById);
router.patch('/:id/read', [...notificationIdValidator], validate, notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', [...notificationIdValidator], validate, notificationController.deleteNotification);

export default router;
