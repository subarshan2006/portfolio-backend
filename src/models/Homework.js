import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: [true, 'Homework title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        subject: {
            type: String,
            trim: true,
        },
        chapter: {
            type: String,
            trim: true,
        },
        assignedDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        status: {
            type: String,
            enum: ['ASSIGNED', 'SUBMITTED', 'PENDING', 'OVERDUE', 'EXCUSED', 'GRADED'],
            default: 'ASSIGNED',
            index: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM',
        },
        totalMarks: {
            type: Number,
            min: 0,
        },
        obtainedMarks: {
            type: Number,
            min: 0,
        },
        feedback: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        submittedAt: {
            type: Date,
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

homeworkSchema.index({ tutorId: 1, studentId: 1, status: 1 });
homeworkSchema.index({ tutorId: 1, dueDate: 1 });
homeworkSchema.index({ tutorId: 1, deletedAt: 1 });

const Homework = mongoose.model('Homework', homeworkSchema);

export default Homework;
