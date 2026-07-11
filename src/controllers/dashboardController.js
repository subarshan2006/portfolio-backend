import asyncHandler from '../middleware/asyncHandler.js';
import * as dashboardService from '../services/dashboardService.js';
import ApiResponse from '../utils/apiResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getDashboardStats(req.tutorId);
    return ApiResponse.success(res, { data: stats });
});

export const getMonthlyOverview = asyncHandler(async (req, res) => {
    const { year, month } = req.query;
    const overview = await dashboardService.getMonthlyOverview(
        req.tutorId,
        parseInt(year, 10) || new Date().getFullYear(),
        parseInt(month, 10) || new Date().getMonth() + 1
    );
    return ApiResponse.success(res, { data: overview });
});

export const getRecentActivity = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const activity = await dashboardService.getRecentActivity(req.tutorId, parseInt(limit, 10) || 10);
    return ApiResponse.success(res, { data: activity });
});

export const getStudentPerformanceOverview = asyncHandler(async (req, res) => {
    const overview = await dashboardService.getStudentPerformanceOverview(req.tutorId);
    return ApiResponse.success(res, { data: overview });
});
