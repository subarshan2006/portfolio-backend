import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['SESSION_REMINDER', 'SESSION_MISSED', 'HOMEWORK_PENDING', 'HOMEWORK_OVERDUE', 'BIRTHDAY', 'FEE_DUE', 'SESSION_CONFLICT', 'GOAL_DEADLINE', 'SUMMARY_EMAIL_FAILED', 'STUDENT_MILESTONE'],
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            default: 'MEDIUM',
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        entityType: {
            type: String,
            enum: ['SESSION', 'STUDENT', 'HOMEWORK', 'SUMMARY', 'GOAL', null],
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ tutorId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ tutorId: 1, type: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
