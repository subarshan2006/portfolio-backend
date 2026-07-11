import ActivityLog from '../models/ActivityLog.js';

class ActivityLogService {
    async log({ tutorId, entityType, entityId, action, previousData = null, newData = null, metadata = null }) {
        return ActivityLog.create({
            tutorId,
            entityType,
            entityId,
            action,
            previousData,
            newData,
            metadata,
        });
    }

    async getActivities(tutorId, { page = 1, limit = 20, entityType, action } = {}) {
        const skip = (page - 1) * limit;
        const query = { tutorId };
        if (entityType) query.entityType = entityType;
        if (action) query.action = action;

        const [activities, total] = await Promise.all([
            ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ActivityLog.countDocuments(query),
        ]);

        return {
            activities,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        };
    }

    async getEntityHistory(tutorId, entityType, entityId) {
        return ActivityLog.find({ tutorId, entityType, entityId })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    async getRecentActivities(tutorId, limit = 10) {
        return ActivityLog.find({ tutorId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}

export default new ActivityLogService();
