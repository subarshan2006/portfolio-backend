import sessionRepository from '../repositories/sessionRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import summaryRepository from '../repositories/summaryRepository.js';
import Session from '../models/Session.js';
import Student from '../models/Student.js';

export const getDashboardStats = async (tutorId) => {
    const [
        totalStudents,
        activeStudents,
        totalSessions,
        scheduledSessions,
        completedSessions,
        cancelledSessions,
        missedSessions,
        upcomingSessions,
    ] = await Promise.all([
        Student.countDocuments({ tutorId, deletedAt: null }),
        Student.countDocuments({ tutorId, status: 'ACTIVE', deletedAt: null }),
        Session.countDocuments({ tutorId, deletedAt: null }),
        Session.countDocuments({ tutorId, status: 'SCHEDULED', deletedAt: null }),
        Session.countDocuments({ tutorId, status: 'COMPLETED', deletedAt: null }),
        Session.countDocuments({ tutorId, status: 'CANCELLED', deletedAt: null }),
        Session.countDocuments({ tutorId, status: 'MISSED', deletedAt: null }),
        sessionRepository.findUpcomingSessions(tutorId, 7),
    ]);

    const todaySessions = await sessionRepository.findTodaySessions(tutorId);
    const todayCount = todaySessions.length;

    const completionRate = totalSessions > 0
        ? Math.round((completedSessions / (completedSessions + cancelledSessions + missedSessions)) * 100)
        : 0;

    const attendanceRate = totalSessions > 0
        ? Math.round((completedSessions / (completedSessions + missedSessions)) * 100)
        : 0;

    return {
        students: {
            total: totalStudents,
            active: activeStudents,
        },
        sessions: {
            total: totalSessions,
            scheduled: scheduledSessions,
            completed: completedSessions,
            cancelled: cancelledSessions,
            missed: missedSessions,
            today: todayCount,
            upcoming: upcomingSessions.length,
        },
        rates: {
            completion: completionRate,
            attendance: attendanceRate,
        },
        upcomingSessions: upcomingSessions.slice(0, 5),
        todaySessions,
    };
};

export const getMonthlyOverview = async (tutorId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const sessions = await Session.find({
        tutorId,
        date: { $gte: startDate, $lte: endDate },
        deletedAt: null,
    }).populate('studentId', 'name grade');

    const completed = sessions.filter((s) => s.status === 'COMPLETED').length;
    const cancelled = sessions.filter((s) => s.status === 'CANCELLED').length;
    const missed = sessions.filter((s) => s.status === 'MISSED').length;
    const scheduled = sessions.filter((s) => s.status === 'SCHEDULED').length;

    const sessionsByStudent = {};
    sessions.forEach((s) => {
        const name = s.studentId?.name || 'Unknown';
        if (!sessionsByStudent[name]) sessionsByStudent[name] = { completed: 0, cancelled: 0, missed: 0, total: 0 };
        sessionsByStudent[name].total++;
        if (s.status === 'COMPLETED') sessionsByStudent[name].completed++;
        if (s.status === 'CANCELLED') sessionsByStudent[name].cancelled++;
        if (s.status === 'MISSED') sessionsByStudent[name].missed++;
    });

    const totalHours = sessions
        .filter((s) => s.status === 'COMPLETED')
        .reduce((acc, s) => acc + (s.duration || 0), 0) / 60;

    return {
        year,
        month,
        overview: { total: sessions.length, completed, cancelled, missed, scheduled },
        totalHours: Math.round(totalHours * 10) / 10,
        sessionsByStudent,
        sessions,
    };
};

export const getRecentActivity = async (tutorId, limit = 10) => {
    const recentSessions = await Session.find({ tutorId, deletedAt: null })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .populate('studentId', 'name');

    return recentSessions;
};

export const getStudentPerformanceOverview = async (tutorId) => {
    const students = await Student.find({ tutorId, status: 'ACTIVE', deletedAt: null });

    const overview = [];
    for (const student of students) {
        const [totalSessions, completedSessions, summaries] = await Promise.all([
            Session.countDocuments({ tutorId, studentId: student._id, deletedAt: null }),
            Session.countDocuments({ tutorId, studentId: student._id, status: 'COMPLETED', deletedAt: null }),
            summaryRepository.getStudentProgress(student._id, tutorId, 5),
        ]);

        const avgUnderstanding = summaries.length > 0
            ? Math.round(summaries.reduce((acc, s) => acc + (s.understandingLevel || 0), 0) / summaries.length * 10) / 10
            : null;

        overview.push({
            student: { _id: student._id, name: student.name, grade: student.grade },
            totalSessions,
            completedSessions,
            attendanceRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
            avgUnderstanding,
            recentSummaries: summaries.length,
        });
    }

    return overview;
};
