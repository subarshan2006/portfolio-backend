import asyncHandler from '../middleware/asyncHandler.js';
import * as formulaService from '../services/formulaService.js';
import ApiResponse from '../utils/apiResponse.js';

export const createFormula = asyncHandler(async (req, res) => {
    const formula = await formulaService.createFormula(req.tutorId, req.body);
    return ApiResponse.created(res, { data: formula, message: 'Formula created' });
});

export const getFormulaById = asyncHandler(async (req, res) => {
    const formula = await formulaService.getFormulaById(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: formula });
});

export const getAllFormulas = asyncHandler(async (req, res) => {
    const { page, limit, category, subject, search } = req.query;
    const result = await formulaService.getAllFormulas(req.tutorId, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        category,
        subject,
        search,
    });
    return ApiResponse.paginated(res, {
        data: result.formulas,
        ...result.pagination,
        message: 'Formulas retrieved',
    });
});

export const updateFormula = asyncHandler(async (req, res) => {
    const formula = await formulaService.updateFormula(req.params.id, req.tutorId, req.body);
    return ApiResponse.success(res, { data: formula, message: 'Formula updated' });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
    const formula = await formulaService.toggleFavorite(req.params.id, req.tutorId);
    return ApiResponse.success(res, { data: formula, message: 'Favorite toggled' });
});

export const deleteFormula = asyncHandler(async (req, res) => {
    await formulaService.deleteFormula(req.params.id, req.tutorId);
    return ApiResponse.success(res, { message: 'Formula deleted' });
});

export const getFormulasByCategory = asyncHandler(async (req, res) => {
    const formulas = await formulaService.getFormulasByCategory(req.tutorId, req.params.category);
    return ApiResponse.success(res, { data: formulas });
});

export const getFavoriteFormulas = asyncHandler(async (req, res) => {
    const formulas = await formulaService.getFavoriteFormulas(req.tutorId);
    return ApiResponse.success(res, { data: formulas });
});
