import asyncHandler from '../middleware/asyncHandler.js';
import * as homeworkService from '../services/homeworkService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const createHomework = asyncHandler(async (req, res) => {
    const homework = await homeworkService.createHomework(req.tutorId, req.body);
    return ApiResponse.created(res, { data: homework, message: MESSAGES.HOMEWORK_CREATED });
});

export const getHomeworkById = asyncHandler(async (req, res) => {
    const homework = await homeworkService.getHomeworkById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: homework });
});

export const getAllHomework = asyncHandler(async (req, res) => {
    const { page, limit, status, studentId, sortBy, order } = req.query;
    const result = await homeworkService.getAllHomework(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        status,
        studentId,
        sortBy,
        order,
    });
    return ApiResponse.paginated(res, {
        data: result.homework,
        ...result.pagination,
        message: 'Homework retrieved',
    });
});

export const updateHomework = asyncHandler(async (req, res) => {
    const homework = await homeworkService.updateHomework(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: homework, message: MESSAGES.HOMEWORK_UPDATED });
});

export const markSubmitted = asyncHandler(async (req, res) => {
    const homework = await homeworkService.markSubmitted(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: homework, message: MESSAGES.HOMEWORK_MARKED_SUBMITTED });
});

export const gradeHomework = asyncHandler(async (req, res) => {
    const homework = await homeworkService.gradeHomework(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: homework, message: 'Homework graded' });
});

export const deleteHomework = asyncHandler(async (req, res) => {
    await homeworkService.deleteHomework(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.HOMEWORK_DELETED });
});

export const getOverdueHomework = asyncHandler(async (req, res) => {
    const homework = await homeworkService.getOverdueHomework(req.tutorId);
    return ApiResponse.success(res, { data: homework });
});

export const getHomeworkByStudent = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await homeworkService.getHomeworkByStudent(
        req.params.studentId,
        req.tutorId,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
    );
    return ApiResponse.paginated(res, {
        data: result.homework,
        ...result.pagination,
    });
});
