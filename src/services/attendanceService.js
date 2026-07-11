import Attendance from '../models/Attendance.js';

class AttendanceService {
    async markAttendance(tutorId, { sessionId, studentId, date, status, notes }) {
        const attendance = await Attendance.findOneAndUpdate(
            { sessionId },
            {
                tutorId,
                studentId,
                date,
                status,
                notes,
                markedAt: new Date(),
            },
            { new: true, upsert: true }
        );
        return attendance;
    }

    async getStudentAttendance(studentId, tutorId, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const query = { studentId, tutorId };

        const [attendance, total] = await Promise.all([
            Attendance.find(query).sort({ date: -1 }).skip(skip).limit(limit),
            Attendance.countDocuments(query),
        ]);

        return {
            attendance,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getStudentAttendanceStats(studentId, tutorId) {
        const stats = await Attendance.aggregate([
            { $match: { studentId, tutorId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const total = stats.reduce((acc, s) => acc + s.count, 0);
        const present = stats.find((s) => s._id === 'PRESENT')?.count || 0;
        const late = stats.find((s) => s._id === 'LATE')?.count || 0;
        const absent = stats.find((s) => s._id === 'ABSENT')?.count || 0;
        const cancelled = stats.find((s) => s._id === 'CANCELLED')?.count || 0;

        const attended = present + late;
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

        return {
            total,
            present,
            late,
            absent,
            cancelled,
            attended,
            percentage,
        };
    }

    async getAttendanceReport(tutorId, { startDate, endDate, studentId } = {}) {
        const query = { tutorId };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (studentId) query.studentId = studentId;

        return Attendance.find(query)
            .sort({ date: -1 })
            .populate('studentId', 'name grade');
    }
}

export default new AttendanceService();
