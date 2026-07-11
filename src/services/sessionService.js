import sessionRepository from '../repositories/sessionRepository.js';
import summaryRepository from '../repositories/summaryRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import * as notificationService from './notificationService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';
import { timeToMinutes, addDays, getStartOfWeek, getEndOfWeek } from '../utils/dateUtils.js';
import { doTimesOverlap } from '../utils/dateUtils.js';

export const createSession = async (tutorId, data) => {
    const { date, startTime, endTime, studentId, isRecurring, recurringPattern } = data;

    // Validate time order
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        throw ApiError.badRequest('End time must be after start time');
    }

    // Check for tutor conflict
    const tutorConflict = await sessionRepository.findTutorConflict(tutorId, date, startTime, endTime);
    if (tutorConflict) {
        throw ApiError.conflict(MESSAGES.SESSION_CONFLICT);
    }

    // Check for student conflict
    const studentConflict = await sessionRepository.findConflictingSession(tutorId, studentId, date, startTime, endTime);
    if (studentConflict) {
        throw ApiError.conflict('This student already has a session at this time');
    }

    if (isRecurring && recurringPattern) {
        return createRecurringSessions(tutorId, data);
    }

    const session = await sessionRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: session._id,
        action: ACTIVITY_TYPE.SESSION_CREATED,
        newData: { date, startTime, endTime, studentId },
    });

    return session;
};

const createRecurringSessions = async (tutorId, data) => {
    const { date, startTime, endTime, studentId, recurringPattern } = data;
    const { frequency, endDate } = recurringPattern;
    const sessions = [];

    let currentDate = new Date(date);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const tutorConflict = await sessionRepository.findTutorConflict(tutorId, currentDate, startTime, endTime);
        if (!tutorConflict) {
            const session = await sessionRepository.create({
                tutorId,
                studentId,
                date: new Date(currentDate),
                startTime,
                endTime,
                duration: data.duration,
                topicPlanned: data.topicPlanned,
                isRecurring: true,
                recurringPattern,
            });
            sessions.push(session);
        }

        // Calculate next occurrence
        if (frequency === 'WEEKLY') {
            currentDate = addDays(currentDate, 7);
        } else if (frequency === 'BIWEEKLY') {
            currentDate = addDays(currentDate, 14);
        } else if (frequency === 'MONTHLY') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    if (sessions.length > 0) {
        await activityLogService.log({
            tutorId,
            entityType: ENTITY_TYPE.SESSION,
            entityId: sessions[0]._id,
            action: ACTIVITY_TYPE.SESSION_CREATED,
            newData: { recurring: true, count: sessions.length },
        });
    }

    return sessions;
};

export const getAllSessions = async (tutorId, { page = 1, limit = 10, sortBy = 'date', order = 'desc', status, studentId, startDate, endDate } = {}) => {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    let query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await sessionRepository.findByTutor(tutorId, query, sort, skip, limit);
    const total = await sessionRepository.countByTutor(tutorId, query);

    return {
        sessions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};

export const getSessionById = async (sessionId, tutorId) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }
    return session;
};

export const updateSession = async (sessionId, tutorId, data) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    if (session.status !== 'SCHEDULED') {
        throw ApiError.badRequest('Can only update scheduled sessions');
    }

    // Check for conflicts if time/date is changing
    if (data.date || data.startTime || data.endTime) {
        const newDate = data.date || session.date;
        const newStart = data.startTime || session.startTime;
        const newEnd = data.endTime || session.endTime;

        if (timeToMinutes(newStart) >= timeToMinutes(newEnd)) {
            throw ApiError.badRequest('End time must be after start time');
        }

        const tutorConflict = await sessionRepository.findTutorConflict(tutorId, newDate, newStart, newEnd, sessionId);
        if (tutorConflict) {
            throw ApiError.conflict(MESSAGES.SESSION_CONFLICT);
        }
    }

    const updatedSession = await sessionRepository.updateById(sessionId, data);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: sessionId,
        action: ACTIVITY_TYPE.SESSION_UPDATED,
        previousData: { date: session.date, startTime: session.startTime, endTime: session.endTime },
        newData: data,
    });

    return updatedSession;
};

export const updateSessionStatus = async (sessionId, tutorId, status) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    const updatedSession = await sessionRepository.updateById(sessionId, { status });

    let action = ACTIVITY_TYPE.SESSION_UPDATED;
    if (status === 'COMPLETED') action = ACTIVITY_TYPE.SESSION_COMPLETED;
    if (status === 'CANCELLED') action = ACTIVITY_TYPE.SESSION_CANCELLED;

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: sessionId,
        action,
        previousData: { status: session.status },
        newData: { status },
    });

    return updatedSession;
};

export const markAttendance = async (sessionId, tutorId, attendance) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    const updatedSession = await sessionRepository.updateById(sessionId, { attendance });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.ATTENDANCE,
        entityId: sessionId,
        action: ACTIVITY_TYPE.ATTENDANCE_MARKED,
        newData: { attendance, studentId: session.studentId },
    });

    return updatedSession;
};

export const rescheduleSession = async (sessionId, tutorId, newDate, newStartTime, newEndTime) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    // Check for conflicts at new time
    const tutorConflict = await sessionRepository.findTutorConflict(tutorId, newDate, newStartTime, newEndTime);
    if (tutorConflict) {
        throw ApiError.conflict(MESSAGES.SESSION_CONFLICT);
    }

    // Mark old session as RESCHEDULED
    await sessionRepository.updateById(sessionId, { status: 'RESCHEDULED' });

    // Create new session
    const newSession = await sessionRepository.create({
        ...session.toObject(),
        _id: undefined,
        date: new Date(newDate),
        startTime: newStartTime,
        endTime: newEndTime,
        duration: timeToMinutes(newEndTime) - timeToMinutes(newStartTime) || session.duration,
        status: 'SCHEDULED',
        parentSessionId: session._id,
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: sessionId,
        action: ACTIVITY_TYPE.SESSION_RESCHEDULED,
        previousData: { date: session.date, startTime: session.startTime },
        newData: { date: newDate, startTime: newStartTime, endTime: newEndTime },
    });

    return newSession;
};

export const deleteSession = async (sessionId, tutorId) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    await sessionRepository.softDelete(sessionId, tutorId);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: sessionId,
        action: ACTIVITY_TYPE.SESSION_CANCELLED,
        previousData: { date: session.date, studentId: session.studentId },
    });

    return true;
};

export const getTodaySessions = async (tutorId) => {
    return sessionRepository.findTodaySessions(tutorId);
};

export const getUpcomingSessions = async (tutorId, days = 7) => {
    return sessionRepository.findUpcomingSessions(tutorId, days);
};

export const getWeeklySchedule = async (tutorId, date) => {
    const startDate = getStartOfWeek(new Date(date));
    const sessions = await sessionRepository.findWeeklySchedule(tutorId, startDate);
    const endDate = getEndOfWeek(startDate);

    // Group by day
    const schedule = {};
    for (let i = 0; i < 7; i++) {
        const day = addDays(startDate, i);
        const dayKey = day.toISOString().split('T')[0];
        schedule[dayKey] = sessions.filter((s) => {
            const sessionDate = new Date(s.date).toISOString().split('T')[0];
            return sessionDate === dayKey;
        });
    }

    return { startDate, endDate, schedule, sessions };
};

export const getMonthlySchedule = async (tutorId, year, month) => {
    const sessions = await sessionRepository.findMonthlySchedule(tutorId, year, month);

    const schedule = {};
    sessions.forEach((session) => {
        const dayKey = new Date(session.date).toISOString().split('T')[0];
        if (!schedule[dayKey]) schedule[dayKey] = [];
        schedule[dayKey].push(session);
    });

    return { year, month, schedule, sessions };
};

export const getSessionsByStudent = async (studentId, tutorId, page = 1, limit = 10) => {
    return sessionRepository.findSessionsByStudent(studentId, tutorId, page, limit);
};

export const getSessionStats = async (tutorId) => {
    const today = await sessionRepository.countTodaySessions(tutorId);
    const upcoming = await sessionRepository.countUpcomingSessions(tutorId);
    const scheduled = await sessionRepository.countByStatus(tutorId, 'SCHEDULED');
    const completed = await sessionRepository.countByStatus(tutorId, 'COMPLETED');
    const cancelled = await sessionRepository.countByStatus(tutorId, 'CANCELLED');
    const missed = await sessionRepository.countByStatus(tutorId, 'MISSED');

    return { today, upcoming, scheduled, completed, cancelled, missed };
};

export const checkConflicts = async (tutorId, date, startTime, endTime, excludeSessionId) => {
    const conflict = await sessionRepository.findTutorConflict(tutorId, date, startTime, endTime, excludeSessionId);
    return {
        hasConflict: !!conflict,
        conflictingSession: conflict || null,
    };
};

export const completeSession = async (sessionId, tutorId, summaryData) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    if (session.status === 'COMPLETED') {
        throw ApiError.badRequest('Session is already completed');
    }

    const updatedSession = await sessionRepository.updateById(sessionId, {
        status: 'COMPLETED',
        topicCompleted: summaryData.topicCompleted || session.topicPlanned,
        homeworkGiven: summaryData.homeworkGiven,
        homeworkStatus: summaryData.homeworkGiven ? 'ASSIGNED' : session.homeworkStatus,
        understandingLevel: summaryData.understandingLevel,
        focusLevel: summaryData.focusLevel,
        overallRating: summaryData.overallRating,
        personalNotes: summaryData.personalNotes,
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SESSION,
        entityId: sessionId,
        action: ACTIVITY_TYPE.SESSION_COMPLETED,
        previousData: { status: session.status },
        newData: {
            status: 'COMPLETED',
            topicCompleted: summaryData.topicCompleted,
            understandingLevel: summaryData.understandingLevel,
        },
    });

    return updatedSession;
};
