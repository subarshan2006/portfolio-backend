import doubtRepository from '../repositories/doubtRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';

export const createDoubt = async (tutorId, data) => {
    const student = await studentRepository.findByIdAndTutor(data.studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const doubt = await doubtRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.DOUBT,
        entityId: doubt._id,
        action: ACTIVITY_TYPE.STUDENT_CREATED,
        newData: { question: data.question, studentId: data.studentId, topic: data.topic },
    });

    return doubt;
};

export const getDoubtById = async (doubtId, tutorId) => {
    const doubt = await doubtRepository.findById(doubtId);
    if (!doubt || doubt.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound('Doubt not found');
    }
    return doubt;
};

export const getAllDoubts = async (tutorId, { page = 1, limit = 10, status, studentId, topic } = {}) => {
    const skip = (page - 1) * limit;
    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (topic) query.topic = topic;

    const doubts = await doubtRepository.findByTutor(tutorId, query, { createdAt: -1 }, skip, limit);
    const total = await doubtRepository.countByTutor(tutorId, query);

    return {
        doubts,
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

export const answerDoubt = async (doubtId, tutorId, { answer, resolutionNotes }) => {
    const doubt = await getDoubtById(doubtId, tutorId);

    const updated = await doubtRepository.updateById(doubtId, {
        answer,
        resolutionNotes,
        status: 'ANSWERED',
        resolvedAt: new Date(),
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.DOUBT,
        entityId: doubtId,
        action: ACTIVITY_TYPE.HOMEWORK_UPDATED,
        previousData: { status: doubt.status },
        newData: { status: 'ANSWERED' },
    });

    return updated;
};

export const resolveDoubt = async (doubtId, tutorId) => {
    const doubt = await getDoubtById(doubtId, tutorId);

    const updated = await doubtRepository.updateById(doubtId, {
        status: 'RESOLVED',
        resolvedAt: new Date(),
    });

    return updated;
};

export const updateDoubt = async (doubtId, tutorId, data) => {
    await getDoubtById(doubtId, tutorId);
    return doubtRepository.updateById(doubtId, data);
};

export const deleteDoubt = async (doubtId, tutorId) => {
    await getDoubtById(doubtId, tutorId);
    await doubtRepository.softDelete(doubtId);
    return true;
};

export const getDoubtsByStudent = async (studentId, tutorId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const doubts = await doubtRepository.findByStudent(studentId, tutorId, skip, limit);
    const total = await doubtRepository.countByTutor(tutorId, { studentId });

    return {
        doubts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

export const getDoubtsByTopic = async (tutorId, topic) => {
    return doubtRepository.findByTopic(tutorId, topic);
};
