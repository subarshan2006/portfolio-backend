import Goal from '../models/Goal.js';

class GoalRepository {
    async create(data) {
        return Goal.create(data);
    }

    async findById(goalId) {
        return Goal.findOne({ _id: goalId, deletedAt: null });
    }

    async findByTutor(tutorId, query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return Goal.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('studentId', 'name grade');
    }

    async countByTutor(tutorId, query = {}) {
        return Goal.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async findByStudent(studentId, tutorId, skip = 0, limit = 10) {
        return Goal.find({ tutorId, studentId, deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async updateById(goalId, data) {
        return Goal.findByIdAndUpdate(goalId, data, { new: true });
    }

    async softDelete(goalId) {
        return Goal.findByIdAndUpdate(goalId, { deletedAt: new Date() });
    }

    async findUpcomingDeadlines(tutorId, days = 7) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        return Goal.find({
            tutorId,
            status: 'ACTIVE',
            targetDate: { $lte: futureDate, $gte: new Date() },
            deletedAt: null,
        })
            .sort({ targetDate: 1 })
            .populate('studentId', 'name grade');
    }

    async findByStatus(tutorId, status) {
        return Goal.find({ tutorId, status, deletedAt: null })
            .sort({ createdAt: -1 })
            .populate('studentId', 'name grade');
    }
}

export default new GoalRepository();
