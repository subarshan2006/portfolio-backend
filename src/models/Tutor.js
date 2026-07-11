import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        profilePhoto: {
            type: String,
        },
        settings: {
            timezone: { type: String, default: 'Asia/Kolkata' },
            emailNotifications: { type: Boolean, default: true },
            sessionReminderMinutes: { type: Number, default: 30, min: 5, max: 120 },
            feeReminderDayOfMonth: { type: Number, default: 1, min: 1, max: 28 },
            workingDays: [{ type: Number, min: 0, max: 6 }],
            workingHours: {
                start: { type: String, default: '09:00' },
                end: { type: String, default: '21:00' },
            },
        },
        refreshTokens: [
            {
                token: { type: String, select: false },
                createdAt: { type: Date, default: Date.now },
                expiresAt: { type: Date },
            },
        ],
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date },
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

tutorSchema.index({ email: 1 });

const Tutor = mongoose.model('Tutor', tutorSchema);

export default Tutor;
