import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';

const MAX_STUDENTS = 10;

export const createStudent = async (tutorId, data) => {
    const count = await studentRepository.countActiveByTutor(tutorId);
    if (count >= MAX_STUDENTS) {
        throw ApiError.conflict(MESSAGES.STUDENT_LIMIT_REACHED);
    }

    const student = await studentRepository.create({ ...data, tutorId });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.STUDENT,
        entityId: student._id,
        action: ACTIVITY_TYPE.STUDENT_CREATED,
        newData: { name: student.name, grade: student.grade },
    });

    return student;
};

export const getAllStudents = async (tutorId, { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', status, search } = {}) => {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    let query = {};
    if (status) query.status = status;

    let students;
    let total;

    if (search) {
        students = await studentRepository.searchByTutor(tutorId, search, skip, limit);
        total = await studentRepository.countSearchByTutor(tutorId, search);
    } else {
        students = await studentRepository.findByTutor(tutorId, query, sort, skip, limit);
        total = await studentRepository.countByTutor(tutorId, query);
    }

    return {
        students,
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

export const getStudentById = async (studentId, tutorId) => {
    const student = await studentRepository.findByIdAndTutor(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }
    return student;
};

export const updateStudent = async (studentId, tutorId, data) => {
    const student = await studentRepository.findByIdAndTutor(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const updatedStudent = await studentRepository.updateById(studentId, data);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.STUDENT,
        entityId: studentId,
        action: ACTIVITY_TYPE.STUDENT_UPDATED,
        previousData: { name: student.name, status: student.status },
        newData: data,
    });

    return updatedStudent;
};

export const updateStudentStatus = async (studentId, tutorId, status) => {
    const student = await studentRepository.findByIdAndTutor(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const updatedStudent = await studentRepository.updateById(studentId, { status });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.STUDENT,
        entityId: studentId,
        action: ACTIVITY_TYPE.STUDENT_UPDATED,
        previousData: { status: student.status },
        newData: { status },
    });

    return updatedStudent;
};

export const deleteStudent = async (studentId, tutorId) => {
    const student = await studentRepository.softDelete(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.STUDENT,
        entityId: studentId,
        action: ACTIVITY_TYPE.STUDENT_DELETED,
        previousData: { name: student.name },
    });

    return student;
};

export const restoreStudent = async (studentId, tutorId) => {
    const count = await studentRepository.countActiveByTutor(tutorId);
    if (count >= MAX_STUDENTS) {
        throw ApiError.conflict(MESSAGES.STUDENT_LIMIT_REACHED);
    }

    const student = await studentRepository.restore(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.STUDENT,
        entityId: studentId,
        action: ACTIVITY_TYPE.STUDENT_RESTORED,
        newData: { name: student.name },
    });

    return student;
};

export const getStudentCounts = async (tutorId) => {
    const active = await studentRepository.countByStatus(tutorId, 'ACTIVE');
    const paused = await studentRepository.countByStatus(tutorId, 'PAUSED');
    const graduated = await studentRepository.countByStatus(tutorId, 'GRADUATED');
    const dropped = await studentRepository.countByStatus(tutorId, 'DROPPED');
    return { active, paused, graduated, dropped, total: active + paused + graduated + dropped };
};

export const searchStudents = async (tutorId, searchTerm, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const students = await studentRepository.searchByTutor(tutorId, searchTerm, skip, limit);
    const total = await studentRepository.countSearchByTutor(tutorId, searchTerm);
    return {
        students,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
