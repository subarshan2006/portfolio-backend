import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        entityType: {
            type: String,
            enum: ['STUDENT', 'SESSION', 'SUMMARY', 'HOMEWORK', 'ATTENDANCE', 'GOAL', 'FORMULA', 'DOUBT'],
            required: true,
            index: true,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        action: {
            type: String,
            enum: [
                'STUDENT_CREATED', 'STUDENT_UPDATED', 'STUDENT_DELETED', 'STUDENT_RESTORED',
                'SESSION_CREATED', 'SESSION_UPDATED', 'SESSION_CANCELLED', 'SESSION_COMPLETED', 'SESSION_RESCHEDULED',
                'SUMMARY_CREATED', 'SUMMARY_EMAILED',
                'HOMEWORK_CREATED', 'HOMEWORK_UPDATED', 'HOMEWORK_SUBMITTED',
                'ATTENDANCE_MARKED',
                'GOAL_CREATED', 'GOAL_COMPLETED',
            ],
            required: true,
        },
        previousData: {
            type: mongoose.Schema.Types.Mixed,
        },
        newData: {
            type: mongoose.Schema.Types.Mixed,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

activityLogSchema.index({ tutorId: 1, createdAt: -1 });
activityLogSchema.index({ tutorId: 1, entityType: 1, entityId: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
