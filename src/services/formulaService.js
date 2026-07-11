import formulaRepository from '../repositories/formulaRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';

export const createFormula = async (tutorId, data) => {
    const formula = await formulaRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.FORMULA,
        entityId: formula._id,
        action: ACTIVITY_TYPE.STUDENT_CREATED,
        newData: { title: data.title, category: data.category },
    });

    return formula;
};

export const getFormulaById = async (formulaId, tutorId) => {
    const formula = await formulaRepository.findById(formulaId);
    if (!formula || formula.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound('Formula not found');
    }
    return formula;
};

export const getAllFormulas = async (tutorId, { page = 1, limit = 10, category, subject, search } = {}) => {
    const skip = (page - 1) * limit;
    let formulas;
    let total;

    if (search) {
        formulas = await formulaRepository.searchByTutor(tutorId, search, skip, limit);
        total = formulas.length;
    } else {
        const query = {};
        if (category) query.category = category;
        if (subject) query.subject = subject;
        formulas = await formulaRepository.findByTutor(tutorId, query, { isFavorite: -1, createdAt: -1 }, skip, limit);
        total = await formulaRepository.countByTutor(tutorId, query);
    }

    return {
        formulas,
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

export const updateFormula = async (formulaId, tutorId, data) => {
    await getFormulaById(formulaId, tutorId);
    return formulaRepository.updateById(formulaId, data);
};

export const toggleFavorite = async (formulaId, tutorId) => {
    const formula = await getFormulaById(formulaId, tutorId);
    return formulaRepository.updateById(formulaId, { isFavorite: !formula.isFavorite });
};

export const deleteFormula = async (formulaId, tutorId) => {
    await getFormulaById(formulaId, tutorId);
    await formulaRepository.softDelete(formulaId);
    return true;
};

export const getFormulasByCategory = async (tutorId, category) => {
    return formulaRepository.findByCategory(tutorId, category);
};

export const getFavoriteFormulas = async (tutorId) => {
    return formulaRepository.findFavorites(tutorId);
};
