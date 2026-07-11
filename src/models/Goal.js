import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Goal title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        category: {
            type: String,
            enum: ['ACADEMIC', 'SKILL', 'BEHAVIOR', 'CUSTOM'],
            default: 'ACADEMIC',
        },
        subject: {
            type: String,
            trim: true,
        },
        targetDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED'],
            default: 'ACTIVE',
            index: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM',
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        milestones: [{
            title: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
        }],
        metrics: {
            target: String,
            current: String,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        completedAt: {
            type: Date,
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

goalSchema.index({ tutorId: 1, studentId: 1, status: 1 });
goalSchema.index({ tutorId: 1, targetDate: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
