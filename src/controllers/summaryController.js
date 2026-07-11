import asyncHandler from '../middleware/asyncHandler.js';
import * as summaryService from '../services/summaryService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const createSummary = asyncHandler(async (req, res) => {
    const summary = await summaryService.createSummary(req.tutorId, req.params.sessionId, req.body);
    return ApiResponse.created(res, { data: summary, message: MESSAGES.SUMMARY_CREATED });
});

export const getSummaryById = asyncHandler(async (req, res) => {
    const summary = await summaryService.getSummaryById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: summary });
});

export const getSummaryBySession = asyncHandler(async (req, res) => {
    const summary = await summaryService.getSummaryBySession(req.params.sessionId, req.tutorId);
    return ApiResponse.success(res, { data: summary });
});

export const getAllSummaries = asyncHandler(async (req, res) => {
    const { page, limit, studentId } = req.query;
    const result = await summaryService.getAllSummaries(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        studentId,
    });
    return ApiResponse.paginated(res, {
        data: result.summaries,
        ...result.pagination,
        message: 'Summaries retrieved successfully',
    });
});

export const updateSummary = asyncHandler(async (req, res) => {
    const summary = await summaryService.updateSummary(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: summary, message: MESSAGES.SUMMARY_UPDATED });
});

export const emailSummary = asyncHandler(async (req, res) => {
    const result = await summaryService.emailSummary(req.params.id, req.tutorId);
    return ApiResponse.success(res, {
        data: result.summary,
        message: result.success ? MESSAGES.SUMMARY_EMAILED : MESSAGES.EMAIL_FAILED,
    });
});

export const resendFailedEmails = asyncHandler(async (req, res) => {
    const results = await summaryService.resendFailedEmails(req.tutorId);
    return ApiResponse.success(res, { data: results, message: 'Resent failed emails' });
});

export const getStudentProgress = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const result = await summaryService.getStudentProgress(req.params.studentId, req.tutorId, parseInt(limit, 10) || 10);
    return ApiResponse.success(res, { data: result });
});
