import Notification from '../models/Notification.js';

class NotificationRepository {
    async create(data) {
        return Notification.create(data);
    }

    async findById(notificationId) {
        return Notification.findOne({ _id: notificationId, deletedAt: null });
    }

    async findByTutor(tutorId, { page = 1, limit = 20, isRead, type, priority } = {}) {
        const skip = (page - 1) * limit;
        const query = { tutorId, deletedAt: null };

        if (isRead !== undefined) query.isRead = isRead;
        if (type) query.type = type;
        if (priority) query.priority = priority;

        const [notifications, total] = await Promise.all([
            Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Notification.countDocuments(query),
        ]);

        return { notifications, total };
    }

    async countUnread(tutorId) {
        return Notification.countDocuments({ tutorId, isRead: false, deletedAt: null });
    }

    async markAsRead(notificationId) {
        return Notification.findByIdAndUpdate(notificationId, { isRead: true, readAt: new Date() }, { new: true });
    }

    async markAllAsRead(tutorId) {
        return Notification.updateMany(
            { tutorId, isRead: false, deletedAt: null },
            { isRead: true, readAt: new Date() }
        );
    }

    async deleteById(notificationId) {
        return Notification.findByIdAndUpdate(notificationId, { deletedAt: new Date() });
    }

    async findRecentByType(tutorId, type, hoursAgo = 24) {
        const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
        return Notification.find({
            tutorId,
            type,
            createdAt: { $gte: since },
            deletedAt: null,
        });
    }
}

export default new NotificationRepository();
