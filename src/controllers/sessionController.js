import asyncHandler from '../middleware/asyncHandler.js';
import * as sessionService from '../services/sessionService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const createSession = asyncHandler(async (req, res) => {
    const result = await sessionService.createSession(req.tutorId, req.body);
    const isArray = Array.isArray(result);
    return ApiResponse.created(res, {
        data: result,
        message: isArray ? `Created ${result.length} recurring sessions` : MESSAGES.SESSION_CREATED,
    });
});

export const getAllSessions = asyncHandler(async (req, res) => {
    const { page, limit, sortBy, order, status, studentId, startDate, endDate } = req.query;
    const result = await sessionService.getAllSessions(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sortBy,
        order,
        status,
        studentId,
        startDate,
        endDate,
    });
    return ApiResponse.paginated(res, {
        data: result.sessions,
        ...result.pagination,
        message: 'Sessions retrieved successfully',
    });
});

export const getSessionById = asyncHandler(async (req, res) => {
    const session = await sessionService.getSessionById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: session });
});

export const updateSession = asyncHandler(async (req, res) => {
    const session = await sessionService.updateSession(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: session, message: MESSAGES.SESSION_UPDATED });
});

export const updateSessionStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const session = await sessionService.updateSessionStatus(req.params.id, req.tutorId, status);
    return ApiResponse.success(res, { data: session, message: 'Session status updated' });
});

export const markAttendance = asyncHandler(async (req, res) => {
    const { attendance } = req.body;
    const session = await sessionService.markAttendance(req.params.id, req.tutorId, attendance);
    return ApiResponse.success(res, { data: session, message: MESSAGES.ATTENDANCE_MARKED });
});

export const rescheduleSession = asyncHandler(async (req, res) => {
    const { date, startTime, endTime } = req.body;
    const session = await sessionService.rescheduleSession(req.params.id, req.tutorId, date, startTime, endTime);
    return ApiResponse.success(res, { data: session, message: MESSAGES.SESSION_RESCHEDULED });
});

export const deleteSession = asyncHandler(async (req, res) => {
    await sessionService.deleteSession(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.SESSION_CANCELLED });
});

export const getTodaySessions = asyncHandler(async (req, res) => {
    const sessions = await sessionService.getTodaySessions(req.tutorId);
    return ApiResponse.success(res, { data: sessions });
});

export const getUpcomingSessions = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const sessions = await sessionService.getUpcomingSessions(req.tutorId, parseInt(days, 10) || 7);
    return ApiResponse.success(res, { data: sessions });
});

export const getWeeklySchedule = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const schedule = await sessionService.getWeeklySchedule(req.tutorId, date || new Date());
    return ApiResponse.success(res, { data: schedule });
});

export const getMonthlySchedule = asyncHandler(async (req, res) => {
    const { year, month } = req.query;
    const schedule = await sessionService.getMonthlySchedule(
        req.tutorId,
        parseInt(year, 10) || new Date().getFullYear(),
        parseInt(month, 10) || new Date().getMonth() + 1
    );
    return ApiResponse.success(res, { data: schedule });
});

export const getSessionsByStudent = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await sessionService.getSessionsByStudent(
        req.params.studentId,
        req.tutorId,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
    );
    return ApiResponse.paginated(res, {
        data: result.sessions,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        total: result.total,
        totalPages: Math.ceil(result.total / (parseInt(limit, 10) || 10)),
    });
});

export const getSessionStats = asyncHandler(async (req, res) => {
    const stats = await sessionService.getSessionStats(req.tutorId);
    return ApiResponse.success(res, { data: stats });
});

export const checkConflicts = asyncHandler(async (req, res) => {
    const { date, startTime, endTime, excludeSessionId } = req.query;
    const result = await sessionService.checkConflicts(req.tutorId, date, startTime, endTime, excludeSessionId);
    return ApiResponse.success(res, { data: result });
});
