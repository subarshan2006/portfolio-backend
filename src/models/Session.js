import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
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
        date: {
            type: Date,
            required: [true, 'Session date is required'],
            index: true,
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide valid start time in HH:MM format'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide valid end time in HH:MM format'],
        },
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [15, 'Session must be at least 15 minutes'],
        },
        status: {
            type: String,
            enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', 'RESCHEDULED'],
            default: 'SCHEDULED',
            index: true,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurringPattern: {
            frequency: { type: String, enum: ['WEEKLY', 'BIWEEKLY', 'MONTHLY'] },
            dayOfWeek: { type: Number, min: 0, max: 6 },
            endDate: Date,
        },
        parentSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
        },
        topicPlanned: {
            type: String,
            trim: true,
        },
        topicCompleted: {
            type: String,
            trim: true,
        },
        homeworkGiven: {
            type: String,
            trim: true,
        },
        homeworkStatus: {
            type: String,
            enum: ['ASSIGNED', 'SUBMITTED', 'PENDING', 'OVERDUE'],
            default: 'ASSIGNED',
        },
        attendance: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'CANCELLED', 'LATE'],
        },
        understandingLevel: {
            type: Number,
            min: 1,
            max: 5,
        },
        focusLevel: {
            type: Number,
            min: 1,
            max: 5,
        },
        overallRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        personalNotes: {
            type: String,
            trim: true,
        },
        preparationNotes: {
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

// Indexes
sessionSchema.index({ tutorId: 1, date: 1, startTime: 1 });
sessionSchema.index({ tutorId: 1, studentId: 1, date: -1 });
sessionSchema.index({ tutorId: 1, status: 1, date: -1 });
sessionSchema.index({ tutorId: 1, deletedAt: 1 });
sessionSchema.index({ studentId: 1, status: 1, date: -1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
