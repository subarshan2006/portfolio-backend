import asyncHandler from '../middleware/asyncHandler.js';
import * as goalService from '../services/goalService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const createGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.createGoal(req.tutorId, req.body);
    return ApiResponse.created(res, { data: goal, message: MESSAGES.GOAL_CREATED });
});

export const getGoalById = asyncHandler(async (req, res) => {
    const goal = await goalService.getGoalById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: goal });
});

export const getAllGoals = asyncHandler(async (req, res) => {
    const { page, limit, status, studentId } = req.query;
    const result = await goalService.getAllGoals(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        status,
        studentId,
    });
    return ApiResponse.paginated(res, {
        data: result.goals,
        ...result.pagination,
        message: 'Goals retrieved',
    });
});

export const updateGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.updateGoal(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: goal, message: MESSAGES.GOAL_UPDATED });
});

export const completeGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.completeGoal(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: goal, message: 'Goal completed' });
});

export const updateGoalProgress = asyncHandler(async (req, res) => {
    const { progress, milestoneIndex } = req.body;
    const goal = await goalService.updateGoalProgress(req.params.id, req.tutorId, progress, milestoneIndex);
    return ApiResponse.success(res, { data: goal, message: 'Goal progress updated' });
});

export const deleteGoal = asyncHandler(async (req, res) => {
    await goalService.deleteGoal(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.GOAL_DELETED });
});

export const getGoalsByStudent = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await goalService.getGoalsByStudent(
        req.params.studentId,
        req.tutorId,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
    );
    return ApiResponse.paginated(res, {
        data: result.goals,
        ...result.pagination,
    });
});

export const getUpcomingDeadlines = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const goals = await goalService.getUpcomingDeadlines(req.tutorId, parseInt(days, 10) || 7);
    return ApiResponse.success(res, { data: goals });
});
