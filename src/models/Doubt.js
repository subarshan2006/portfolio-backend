import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema(
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
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
        },
        question: {
            type: String,
            required: [true, 'Question is required'],
            trim: true,
            maxlength: 3000,
        },
        topic: {
            type: String,
            trim: true,
        },
        subject: {
            type: String,
            trim: true,
        },
        answer: {
            type: String,
            trim: true,
            maxlength: 3000,
        },
        status: {
            type: String,
            enum: ['OPEN', 'ANSWERED', 'PENDING_REVIEW', 'RESOLVED'],
            default: 'OPEN',
            index: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM',
        },
        resolutionNotes: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        askedAt: {
            type: Date,
            default: Date.now,
        },
        resolvedAt: {
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

doubtSchema.index({ tutorId: 1, studentId: 1, status: 1 });
doubtSchema.index({ tutorId: 1, topic: 1 });

const Doubt = mongoose.model('Doubt', doubtSchema);

export default Doubt;
