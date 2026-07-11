import homeworkRepository from '../repositories/homeworkRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import * as notificationService from './notificationService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';

export const createHomework = async (tutorId, data) => {
    const student = await studentRepository.findByIdAndTutor(data.studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const homework = await homeworkRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.HOMEWORK,
        entityId: homework._id,
        action: ACTIVITY_TYPE.HOMEWORK_CREATED,
        newData: { title: data.title, studentId: data.studentId, dueDate: data.dueDate },
    });

    return homework;
};

export const getHomeworkById = async (homeworkId, tutorId) => {
    const homework = await homeworkRepository.findById(homeworkId);
    if (!homework || homework.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.HOMEWORK_NOT_FOUND);
    }
    return homework;
};

export const getAllHomework = async (tutorId, { page = 1, limit = 10, status, studentId, sortBy = 'dueDate', order = 'desc' } = {}) => {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;

    const homework = await homeworkRepository.findByTutor(tutorId, query, sort, skip, limit);
    const total = await homeworkRepository.countByTutor(tutorId, query);

    return {
        homework,
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

export const updateHomework = async (homeworkId, tutorId, data) => {
    const homework = await getHomeworkById(homeworkId, tutorId);
    const updated = await homeworkRepository.updateById(homeworkId, data);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.HOMEWORK,
        entityId: homeworkId,
        action: ACTIVITY_TYPE.HOMEWORK_UPDATED,
        previousData: { status: homework.status },
        newData: data,
    });

    return updated;
};

export const markSubmitted = async (homeworkId, tutorId, { obtainedMarks, feedback } = {}) => {
    const homework = await getHomeworkById(homeworkId, tutorId);

    const updateData = {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        completedAt: new Date(),
    };
    if (obtainedMarks !== undefined) updateData.obtainedMarks = obtainedMarks;
    if (feedback) updateData.feedback = feedback;

    const updated = await homeworkRepository.updateById(homeworkId, updateData);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.HOMEWORK,
        entityId: homeworkId,
        action: ACTIVITY_TYPE.HOMEWORK_SUBMITTED,
        previousData: { status: homework.status },
        newData: { status: 'SUBMITTED', obtainedMarks, feedback },
    });

    return updated;
};

export const gradeHomework = async (homeworkId, tutorId, { obtainedMarks, feedback, status = 'GRADED' }) => {
    const homework = await getHomeworkById(homeworkId, tutorId);

    const updated = await homeworkRepository.updateById(homeworkId, {
        status,
        obtainedMarks,
        feedback,
        completedAt: new Date(),
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.HOMEWORK,
        entityId: homeworkId,
        action: ACTIVITY_TYPE.HOMEWORK_UPDATED,
        newData: { status, obtainedMarks, feedback },
    });

    return updated;
};

export const deleteHomework = async (homeworkId, tutorId) => {
    await getHomeworkById(homeworkId, tutorId);
    await homeworkRepository.softDelete(homeworkId);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.HOMEWORK,
        entityId: homeworkId,
        action: ACTIVITY_TYPE.HOMEWORK_UPDATED,
        newData: { deleted: true },
    });

    return true;
};

export const getOverdueHomework = async (tutorId) => {
    return homeworkRepository.findOverdue(tutorId);
};

export const getHomeworkByStudent = async (studentId, tutorId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const homework = await homeworkRepository.findByStudent(studentId, tutorId, skip, limit);
    const total = await homeworkRepository.countByTutor(tutorId, { studentId });

    return {
        homework,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};
