import asyncHandler from '../middleware/asyncHandler.js';
import * as notificationService from '../services/notificationService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const getNotifications = asyncHandler(async (req, res) => {
    const { page, limit, isRead, type, priority } = req.query;
    const result = await notificationService.getNotifications(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
        isRead: isRead !== undefined ? isRead === 'true' : undefined,
        type,
        priority,
    });
    return ApiResponse.paginated(res, {
        data: result.notifications,
        ...result.pagination,
        unreadCount: result.unreadCount,
        message: 'Notifications retrieved',
    });
});

export const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await notificationService.getNotificationById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: notification });
});

export const markAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAsRead(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.NOTIFICATION_READ });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAsRead(req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.ALL_NOTIFICATIONS_READ });
});

export const deleteNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.NOTIFICATION_DELETED });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.tutorId);
    return ApiResponse.success(res, { data: { unreadCount: count } });
});
