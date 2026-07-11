import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
            required: true,
            unique: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'CANCELLED', 'LATE'],
            required: true,
        },
        markedAt: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ tutorId: 1, studentId: 1, date: -1 });
attendanceSchema.index({ studentId: 1, status: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
