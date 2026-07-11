import summaryRepository from '../repositories/summaryRepository.js';
import sessionRepository from '../repositories/sessionRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import ApiError from '../utils/apiError.js';
import MESSAGES from '../constants/messages.js';
import activityLogService from './activityLogService.js';
import notificationService from './notificationService.js';
import { ACTIVITY_TYPE, ENTITY_TYPE } from '../constants/constants.js';
import { sendSessionSummaryEmail } from './emailService.js';

export const createSummary = async (tutorId, sessionId, data) => {
    const session = await sessionRepository.findByIdAndTutor(sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    const existing = await summaryRepository.findBySession(sessionId);
    if (existing) {
        throw ApiError.badRequest('Summary already exists for this session');
    }

    const student = await studentRepository.findByIdAndTutor(session.studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const summary = await summaryRepository.create({
        tutorId,
        sessionId,
        studentId: session.studentId,
        ...data,
    });

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SUMMARY,
        entityId: summary._id,
        action: ACTIVITY_TYPE.SUMMARY_CREATED,
        newData: { sessionId, studentId: session.studentId, topicsCovered: data.topicsCovered },
    });

    return summary;
};

export const getSummaryById = async (summaryId, tutorId) => {
    const summary = await summaryRepository.findById(summaryId);
    if (!summary || summary.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.SUMMARY_NOT_FOUND);
    }
    return summary;
};

export const getSummaryBySession = async (sessionId, tutorId) => {
    const summary = await summaryRepository.findBySession(sessionId);
    if (!summary || summary.tutorId.toString() !== tutorId.toString()) {
        return null;
    }
    return summary;
};

export const getAllSummaries = async (tutorId, { page = 1, limit = 10, studentId } = {}) => {
    const skip = (page - 1) * limit;

    let summaries;
    let total;

    if (studentId) {
        summaries = await summaryRepository.findByTutorAndStudent(tutorId, studentId, skip, limit);
        total = await summaryRepository.countByTutor(tutorId, { studentId });
    } else {
        summaries = await summaryRepository.findByTutor(tutorId, {}, { createdAt: -1 }, skip, limit);
        total = await summaryRepository.countByTutor(tutorId);
    }

    return {
        summaries,
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

export const updateSummary = async (summaryId, tutorId, data) => {
    const summary = await summaryRepository.findById(summaryId);
    if (!summary || summary.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.SUMMARY_NOT_FOUND);
    }

    const updated = await summaryRepository.updateById(summaryId, data);

    await activityLogService.log({
        tutorId,
        entityType: ENTITY_TYPE.SUMMARY,
        entityId: summaryId,
        action: ACTIVITY_TYPE.SUMMARY_CREATED,
        previousData: summary.toObject(),
        newData: data,
    });

    return updated;
};

export const emailSummary = async (summaryId, tutorId) => {
    const summary = await summaryRepository.findById(summaryId);
    if (!summary || summary.tutorId.toString() !== tutorId.toString()) {
        throw ApiError.notFound(MESSAGES.SUMMARY_NOT_FOUND);
    }

    const session = await sessionRepository.findByIdAndTutor(summary.sessionId, tutorId);
    if (!session) {
        throw ApiError.notFound(MESSAGES.SESSION_NOT_FOUND);
    }

    const student = await studentRepository.findByIdAndTutor(summary.studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const result = await sendSessionSummaryEmail(summary, student, session, {
        name: tutorId.toString(),
    });

    const updateData = {
        emailStatus: result.success ? 'SENT' : 'FAILED',
        emailSentAt: result.success ? new Date() : undefined,
        resendEmailId: result.emailId,
        emailError: result.success ? undefined : result.error,
    };

    await summaryRepository.updateById(summaryId, updateData);

    if (result.success) {
        await activityLogService.log({
            tutorId,
            entityType: ENTITY_TYPE.SUMMARY,
            entityId: summaryId,
            action: ACTIVITY_TYPE.SUMMARY_EMAILED,
            newData: { emailStatus: 'SENT', studentEmail: student.parentEmail },
        });
    } else {
        await notificationService.createNotification(tutorId, {
            type: 'SUMMARY_EMAIL_FAILED',
            title: 'Email Failed',
            message: `Failed to send summary email for ${student.name}: ${result.error}`,
            priority: 'HIGH',
            entityId: summaryId,
            entityType: 'SUMMARY',
        });
    }

    return { success: result.success, summary: await summaryRepository.findById(summaryId) };
};

export const getStudentProgress = async (studentId, tutorId, limit = 10) => {
    const student = await studentRepository.findByIdAndTutor(studentId, tutorId);
    if (!student) {
        throw ApiError.notFound(MESSAGES.STUDENT_NOT_FOUND);
    }

    const progress = await summaryRepository.getStudentProgress(studentId, tutorId, limit);
    return { student, progress };
};

export const resendFailedEmails = async (tutorId) => {
    const pendingSummaries = await summaryRepository.findPendingEmails(tutorId);
    const results = [];

    for (const summary of pendingSummaries) {
        const result = await emailSummary(summary._id, tutorId);
        results.push({ summaryId: summary._id, ...result });
    }

    return results;
};
