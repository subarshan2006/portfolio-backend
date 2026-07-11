import Session from '../models/Session.js';
import BaseRepository from './baseRepository.js';
import { doTimesOverlap, timeToMinutes } from '../utils/dateUtils.js';

class SessionRepository extends BaseRepository {
    constructor() {
        super(Session);
    }

    async findByTutor(tutorId, query = {}, sort = { date: -1 }, skip = 0, limit = 10) {
        return Session.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('studentId', 'name grade');
    }

    async countByTutor(tutorId, query = {}) {
        return Session.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async findByIdAndTutor(sessionId, tutorId) {
        return Session.findOne({ _id: sessionId, tutorId, deletedAt: null })
            .populate('studentId', 'name grade parentName parentEmail');
    }

    async findConflictingSession(tutorId, studentId, date, startTime, endTime, excludeSessionId = null) {
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);

        const query = {
            tutorId,
            date: { $gte: dateStart, $lte: dateEnd },
            status: { $nin: ['CANCELLED', 'RESCHEDULED'] },
            deletedAt: null,
            $or: [
                { studentId },
                { tutorId },
            ],
        };

        if (excludeSessionId) {
            query._id = { $ne: excludeSessionId };
        }

        const sessions = await Session.find(query);

        return sessions.find((session) => doTimesOverlap(startTime, endTime, session.startTime, session.endTime));
    }

    async findTutorConflict(tutorId, date, startTime, endTime, excludeSessionId = null) {
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);

        const query = {
            tutorId,
            date: { $gte: dateStart, $lte: dateEnd },
            status: { $nin: ['CANCELLED', 'RESCHEDULED'] },
            deletedAt: null,
        };

        if (excludeSessionId) {
            query._id = { $ne: excludeSessionId };
        }

        const sessions = await Session.find(query);
        return sessions.find((session) => doTimesOverlap(startTime, endTime, session.startTime, session.endTime));
    }

    async findTodaySessions(tutorId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return Session.find({
            tutorId,
            date: { $gte: today, $lt: tomorrow },
            status: { $nin: ['CANCELLED'] },
            deletedAt: null,
        })
            .sort({ startTime: 1 })
            .populate('studentId', 'name grade');
    }

    async findUpcomingSessions(tutorId, days = 7) {
        const now = new Date();
        const futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + days);

        return Session.find({
            tutorId,
            date: { $gte: now, $lte: futureDate },
            status: 'SCHEDULED',
            deletedAt: null,
        })
            .sort({ date: 1, startTime: 1 })
            .populate('studentId', 'name grade');
    }

    async findWeeklySchedule(tutorId, startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        return Session.find({
            tutorId,
            date: { $gte: startDate, $lt: endDate },
            deletedAt: null,
        })
            .sort({ date: 1, startTime: 1 })
            .populate('studentId', 'name grade');
    }

    async findMonthlySchedule(tutorId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        return Session.find({
            tutorId,
            date: { $gte: startDate, $lte: endDate },
            deletedAt: null,
        })
            .sort({ date: 1, startTime: 1 })
            .populate('studentId', 'name grade');
    }

    async findSessionsByStudent(studentId, tutorId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const sessions = await Session.find({ studentId, tutorId, deletedAt: null })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Session.countDocuments({ studentId, tutorId, deletedAt: null });
        return { sessions, total };
    }

    async findSessionsByStatus(tutorId, status) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const query = { tutorId, status, deletedAt: null };

        if (status === 'SCHEDULED') {
            query.date = { $gte: today };
        }

        return Session.find(query)
            .sort({ date: 1 })
            .populate('studentId', 'name grade');
    }

    async softDelete(sessionId, tutorId) {
        return Session.findOneAndUpdate(
            { _id: sessionId, tutorId },
            { deletedAt: new Date(), status: 'CANCELLED' },
            { new: true }
        );
    }

    async countByStatus(tutorId, status) {
        const query = { tutorId, status, deletedAt: null };
        return Session.countDocuments(query);
    }

    async countTodaySessions(tutorId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return Session.countDocuments({
            tutorId,
            date: { $gte: today, $lt: tomorrow },
            deletedAt: null,
        });
    }

    async countUpcomingSessions(tutorId, days = 7) {
        const now = new Date();
        const futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + days);

        return Session.countDocuments({
            tutorId,
            date: { $gte: now, $lte: futureDate },
            status: 'SCHEDULED',
            deletedAt: null,
        });
    }
}

export default new SessionRepository();
