import Homework from '../models/Homework.js';

class HomeworkRepository {
    async create(data) {
        return Homework.create(data);
    }

    async findById(homeworkId) {
        return Homework.findOne({ _id: homeworkId, deletedAt: null });
    }

    async findByTutor(tutorId, query = {}, sort = { dueDate: -1 }, skip = 0, limit = 10) {
        return Homework.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('studentId', 'name grade');
    }

    async countByTutor(tutorId, query = {}) {
        return Homework.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async findByStudent(studentId, tutorId, skip = 0, limit = 10) {
        return Homework.find({ tutorId, studentId, deletedAt: null })
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(limit);
    }

    async updateById(homeworkId, data) {
        return Homework.findByIdAndUpdate(homeworkId, data, { new: true });
    }

    async softDelete(homeworkId) {
        return Homework.findByIdAndUpdate(homeworkId, { deletedAt: new Date() });
    }

    async findOverdue(tutorId) {
        return Homework.find({
            tutorId,
            status: { $in: ['ASSIGNED', 'PENDING'] },
            dueDate: { $lt: new Date() },
            deletedAt: null,
        }).populate('studentId', 'name grade');
    }

    async findByStatus(tutorId, status) {
        return Homework.find({ tutorId, status, deletedAt: null })
            .sort({ dueDate: -1 })
            .populate('studentId', 'name grade');
    }
}

export default new HomeworkRepository();
