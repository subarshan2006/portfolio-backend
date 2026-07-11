import mongoose from 'mongoose';

const sessionSummarySchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        topicsCovered: {
            type: String,
            required: [true, 'Topics covered is required'],
            trim: true,
        },
        topicsPlanned: {
            type: String,
            trim: true,
        },
        homeworkSummary: {
            type: String,
            trim: true,
        },
        performanceNotes: {
            type: String,
            trim: true,
        },
        understandingLevel: {
            type: Number,
            min: 1,
            max: 5,
        },
        areasOfStrength: {
            type: String,
            trim: true,
        },
        areasForImprovement: {
            type: String,
            trim: true,
        },
        nextSessionPlan: {
            type: String,
            trim: true,
        },
        emailStatus: {
            type: String,
            enum: ['PENDING', 'SENT', 'FAILED', 'BOUNCED'],
            default: 'PENDING',
        },
        emailSentAt: {
            type: Date,
        },
        emailError: {
            type: String,
            trim: true,
        },
        resendEmailId: {
            type: String,
            trim: true,
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

sessionSummarySchema.index({ tutorId: 1, sessionId: 1 }, { unique: true });
sessionSummarySchema.index({ tutorId: 1, studentId: 1, createdAt: -1 });
sessionSummarySchema.index({ tutorId: 1, emailStatus: 1 });

const SessionSummary = mongoose.model('SessionSummary', sessionSummarySchema);

export default SessionSummary;
