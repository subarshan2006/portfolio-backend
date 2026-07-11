import asyncHandler from '../middleware/asyncHandler.js';
import * as studentService from '../services/studentService.js';
import ApiResponse from '../utils/apiResponse.js';
import MESSAGES from '../constants/messages.js';

export const createStudent = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.tutorId, req.body);
    return ApiResponse.created(res, { data: student, message: MESSAGES.STUDENT_CREATED });
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const { page, limit, sortBy, order, status, search } = req.query;
    const result = await studentService.getAllStudents(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sortBy,
        order,
        status,
        search,
    });
    return ApiResponse.paginated(res, {
        data: result.students,
        ...result.pagination,
        message: 'Students retrieved successfully',
    });
});

export const getStudentById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: student });
});

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: student, message: MESSAGES.STUDENT_UPDATED });
});

export const updateStudentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const student = await studentService.updateStudentStatus(req.params.id, req.tutorId, status);
    return ApiResponse.success(res, { data: student, message: MESSAGES.STUDENT_STATUS_UPDATED });
});

export const deleteStudent = asyncHandler(async (req, res) => {
    await studentService.deleteStudent(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: MESSAGES.STUDENT_DELETED });
});

export const restoreStudent = asyncHandler(async (req, res) => {
    const student = await studentService.restoreStudent(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: student, message: MESSAGES.STUDENT_RESTORED });
});

export const searchStudents = asyncHandler(async (req, res) => {
    const { q, page, limit } = req.query;
    if (!q) {
        return ApiResponse.error(res, { message: 'Search query is required', statusCode: 400 });
    }
    const result = await studentService.searchStudents(req.tutorId, q, parseInt(page, 10) || 1, parseInt(limit, 10) || 10);
    return ApiResponse.paginated(res, {
        data: result.students,
        ...result.pagination,
        message: 'Search results',
    });
});
