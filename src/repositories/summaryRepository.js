import SessionSummary from '../models/SessionSummary.js';

class SummaryRepository {
    async create(data) {
        return SessionSummary.create(data);
    }

    async findById(summaryId) {
        return SessionSummary.findOne({ _id: summaryId, deletedAt: null });
    }

    async findByTutor(tutorId, query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return SessionSummary.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('studentId', 'name grade')
            .populate('sessionId', 'date startTime endTime topicCompleted');
    }

    async countByTutor(tutorId, query = {}) {
        return SessionSummary.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async findBySession(sessionId) {
        return SessionSummary.findOne({ sessionId, deletedAt: null });
    }

    async findByTutorAndStudent(tutorId, studentId, skip = 0, limit = 10) {
        return SessionSummary.find({ tutorId, studentId, deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sessionId', 'date startTime endTime topicCompleted');
    }

    async updateById(summaryId, data) {
        return SessionSummary.findByIdAndUpdate(summaryId, data, { new: true });
    }

    async findPendingEmails(tutorId) {
        return SessionSummary.find({
            tutorId,
            emailStatus: 'PENDING',
            deletedAt: null,
        })
            .populate('studentId', 'name grade parentEmail parentName')
            .populate('sessionId', 'date startTime endTime');
    }

    async getStudentProgress(studentId, tutorId, limit = 10) {
        return SessionSummary.find({ tutorId, studentId, deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('topicsCovered understandingLevel performanceNotes areasOfStrength areasForImprovement createdAt');
    }

    async softDelete(summaryId) {
        return SessionSummary.findByIdAndUpdate(summaryId, { deletedAt: new Date() });
    }
}

export default new SummaryRepository();
