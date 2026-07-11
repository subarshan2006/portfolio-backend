import asyncHandler from '../middleware/asyncHandler.js';
import * as doubtService from '../services/doubtService.js';
import ApiResponse from '../utils/apiResponse.js';

export const createDoubt = asyncHandler(async (req, res) => {
    const doubt = await doubtService.createDoubt(req.tutorId, req.body);
    return ApiResponse.created(res, { data: doubt, message: 'Doubt logged' });
});

export const getDoubtById = asyncHandler(async (req, res) => {
    const doubt = await doubtService.getDoubtById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: doubt });
});

export const getAllDoubts = asyncHandler(async (req, res) => {
    const { page, limit, status, studentId, topic } = req.query;
    const result = await doubtService.getAllDoubts(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        status,
        studentId,
        topic,
    });
    return ApiResponse.paginated(res, {
        data: result.doubts,
        ...result.pagination,
        message: 'Doubts retrieved',
    });
});

export const answerDoubt = asyncHandler(async (req, res) => {
    const doubt = await doubtService.answerDoubt(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: doubt, message: 'Doubt answered' });
});

export const resolveDoubt = asyncHandler(async (req, res) => {
    const doubt = await doubtService.resolveDoubt(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: doubt, message: 'Doubt resolved' });
});

export const updateDoubt = asyncHandler(async (req, res) => {
    const doubt = await doubtService.updateDoubt(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: doubt, message: 'Doubt updated' });
});

export const deleteDoubt = asyncHandler(async (req, res) => {
    await doubtService.deleteDoubt(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: 'Doubt deleted' });
});

export const getDoubtsByStudent = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await doubtService.getDoubtsByStudent(
        req.params.studentId,
        req.tutorId,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
    );
    return ApiResponse.paginated(res, {
        data: result.doubts,
        ...result.pagination,
    });
});

export const getDoubtsByTopic = asyncHandler(async (req, res) => {
    const doubts = await doubtService.getDoubtsByTopic(req.tutorId, req.params.topic);
    return ApiResponse.success(res, { data: doubts });
});
