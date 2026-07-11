import goalRepository from '../repositories/goalRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import * as notificationService from './notificationService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';

export const createGoal = async (tutorId, data) => {
    const student = await studentRepository.findByIdAndTutor(data.studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const goal = await goalRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.GOAL,
        entityId: goal._id,
        action: ACTIVITY_TYPE.GOAL_CREATED,
        newData: { title: data.title, studentId: data.studentId },
    });

    return goal;
};

export const getGoalById = async (goalId, tutorId) => {
    const goal = await goalRepository.findById(goalId);
    if (!goal || goal.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.GOAL_NOT_FOUND);
    }
    return goal;
};

export const getAllGoals = async (tutorId, { page = 1, limit = 10, status, studentId } = {}) => {
    const skip = (page - 1) * limit;
    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;

    const goals = await goalRepository.findByTutor(tutorId, query, { createdAt: -1 }, skip, limit);
    const total = await goalRepository.countByTutor(tutorId, query);

    return {
        goals,
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

export const updateGoal = async (goalId, tutorId, data) => {
    await getGoalById(goalId, tutorId);
    const updated = await goalRepository.updateById(goalId, data);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.GOAL,
        entityId: goalId,
        action: ACTIVITY_TYPE.GOAL_UPDATED,
        newData: data,
    });

    return updated;
};

export const completeGoal = async (goalId, tutorId) => {
    const goal = await getGoalById(goalId, tutorId);

    if (goal.status === 'COMPLETED') {
        throw ApiError.badRequest('Goal is already completed');
    }

    const updated = await goalRepository.updateById(goalId, {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.GOAL,
        entityId: goalId,
        action: ACTIVITY_TYPE.GOAL_COMPLETED,
        previousData: { status: goal.status },
        newData: { status: 'COMPLETED' },
    });

    return updated;
};

export const updateGoalProgress = async (goalId, tutorId, progress, milestoneIndex) => {
    const goal = await getGoalById(goalId, tutorId);

    const updateData = { progress };
    if (milestoneIndex !== undefined && goal.milestones[milestoneIndex]) {
        goal.milestones[milestoneIndex].completed = true;
        goal.milestones[milestoneIndex].completedAt = new Date();
        updateData.milestones = goal.milestones;
    }

    if (progress >= 100) {
        updateData.status = 'COMPLETED';
        updateData.completedAt = new Date();
    }

    const updated = await goalRepository.updateById(goalId, updateData);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.GOAL,
        entityId: goalId,
        action: ACTIVITY_TYPE.GOAL_UPDATED,
        newData: { progress, milestoneIndex },
    });

    return updated;
};

export const deleteGoal = async (goalId, tutorId) => {
    await getGoalById(goalId, tutorId);
    await goalRepository.softDelete(goalId);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.GOAL,
        entityId: goalId,
        action: ACTIVITY_TYPE.GOAL_UPDATED,
        newData: { deleted: true },
    });

    return true;
};

export const getGoalsByStudent = async (studentId, tutorId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const goals = await goalRepository.findByStudent(studentId, tutorId, skip, limit);
    const total = await goalRepository.countByTutor(tutorId, { studentId });

    return {
        goals,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

export const getUpcomingDeadlines = async (tutorId, days = 7) => {
    return goalRepository.findUpcomingDeadlines(tutorId, days);
};
