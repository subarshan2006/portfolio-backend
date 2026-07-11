import notificationRepository from '../repositories/notificationRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';

export const createNotification = async (tutorId, { type, title, message, priority = 'MEDIUM', entityId, entityType, metadata }) => {
    return notificationRepository.create({
        tutorId,
        type,
        title,
        message,
        priority,
        entityId,
        entityType,
        metadata,
    });
};

export const getNotifications = async (tutorId, { page = 1, limit = 20, isRead, type, priority } = {}) => {
    const { notifications, total } = await notificationRepository.findByTutor(tutorId, { page, limit, isRead, type, priority });
    const unreadCount = await notificationRepository.countUnread(tutorId);

    return {
        notifications,
        unreadCount,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};

export const getNotificationById = async (notificationId, tutorId) => {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification || notification.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.NOTIFICATION_NOT_FOUND);
    }
    return notification;
};

export const markAsRead = async (notificationId, tutorId) => {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification || notification.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.NOTIFICATION_NOT_FOUND);
    }
    return notificationRepository.markAsRead(notificationId);
};

export const markAllAsRead = async (tutorId) => {
    await notificationRepository.markAllAsRead(tutorId);
    return true;
};

export const deleteNotification = async (notificationId, tutorId) => {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification || notification.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.NOTIFICATION_NOT_FOUND);
    }
    await notificationRepository.deleteById(notificationId);
    return true;
};

export const getUnreadCount = async (tutorId) => {
    return notificationRepository.countUnread(tutorId);
};
