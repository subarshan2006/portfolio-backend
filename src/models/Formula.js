import mongoose from 'mongoose';

const formulaSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tutor',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Formula title is required'],
            trim: true,
            maxlength: 200,
        },
        formula: {
            type: String,
            required: [true, 'Formula text is required'],
            trim: true,
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
        category: {
            type: String,
            enum: ['ALGEBRA', 'GEOMETRY', 'TRIGONOMETRY', 'CALCULUS', 'STATISTICS', 'ARITHMETIC', 'OTHER'],
            default: 'OTHER',
        },
        example: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        isFavorite: {
            type: Boolean,
            default: false,
        },
        studentIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }],
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

formulaSchema.index({ tutorId: 1, category: 1 });
formulaSchema.index({ tutorId: 1, subject: 1 });
formulaSchema.index({ tutorId: 1, deletedAt: 1 });

const Formula = mongoose.model('Formula', formulaSchema);

export default Formula;
