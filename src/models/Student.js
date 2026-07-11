import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        age: {
            type: Number,
            min: [3, 'Age must be at least 3'],
            max: [25, 'Age cannot exceed 25'],
        },
        school: {
            type: String,
            trim: true,
        },
        grade: {
            type: String,
            trim: true,
        },
        parentName: {
            type: String,
            required: [true, 'Parent name is required'],
            trim: true,
        },
        parentMobile: {
            type: String,
            required: [true, 'Parent mobile is required'],
            trim: true,
        },
        parentEmail: {
            type: String,
            required: [true, 'Parent email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid parent email'],
        },
        studentEmail: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid student email'],
        },
        address: {
            type: String,
            trim: true,
        },
        subjects: [
            {
                type: String,
                trim: true,
            },
        ],
        preferredDays: [
            {
                type: Number,
                min: 0,
                max: 6,
            },
        ],
        preferredTime: {
            type: String,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide valid time in HH:MM format'],
        },
        monthlyFee: {
            type: Number,
            min: [0, 'Fee cannot be negative'],
            default: 0,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'PAUSED', 'GRADUATED', 'DROPPED'],
            default: 'ACTIVE',
        },
        notes: {
            type: String,
            trim: true,
        },
        profilePhoto: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        joiningDate: {
            type: Date,
            default: Date.now,
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
studentSchema.index({ tutorId: 1, status: 1 });
studentSchema.index({ tutorId: 1, name: 'text', parentName: 'text', parentEmail: 'text' });
studentSchema.index({ tutorId: 1, deletedAt: 1 });

// Virtual for attendance percentage
studentSchema.virtual('attendancePercentage', {
    ref: 'Attendance',
    localField: '_id',
    foreignField: 'studentId',
    count: true,
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
