import Doubt from '../models/Doubt.js';

class DoubtRepository {
    async create(data) {
        return Doubt.create(data);
    }

    async findById(doubtId) {
        return Doubt.findOne({ _id: doubtId, deletedAt: null });
    }

    async findByTutor(tutorId, query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return Doubt.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('studentId', 'name grade');
    }

    async countByTutor(tutorId, query = {}) {
        return Doubt.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async findByStudent(studentId, tutorId, skip = 0, limit = 10) {
        return Doubt.find({ tutorId, studentId, deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async updateById(doubtId, data) {
        return Doubt.findByIdAndUpdate(doubtId, data, { new: true });
    }

    async softDelete(doubtId) {
        return Doubt.findByIdAndUpdate(doubtId, { deletedAt: new Date() });
    }

    async findByStatus(tutorId, status) {
        return Doubt.find({ tutorId, status, deletedAt: null })
            .sort({ createdAt: -1 })
            .populate('studentId', 'name grade');
    }

    async findByTopic(tutorId, topic) {
        return Doubt.find({ tutorId, topic, deletedAt: null })
            .sort({ createdAt: -1 })
            .populate('studentId', 'name grade');
    }
}

export default new DoubtRepository();
