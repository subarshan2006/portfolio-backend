import Formula from '../models/Formula.js';

class FormulaRepository {
    async create(data) {
        return Formula.create(data);
    }

    async findById(formulaId) {
        return Formula.findOne({ _id: formulaId, deletedAt: null });
    }

    async findByTutor(tutorId, query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return Formula.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async countByTutor(tutorId, query = {}) {
        return Formula.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async searchByTutor(tutorId, searchTerm, skip = 0, limit = 10) {
        return Formula.find({
            tutorId,
            deletedAt: null,
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { formula: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            ],
        })
            .sort({ isFavorite: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async updateById(formulaId, data) {
        return Formula.findByIdAndUpdate(formulaId, data, { new: true });
    }

    async softDelete(formulaId) {
        return Formula.findByIdAndUpdate(formulaId, { deletedAt: new Date() });
    }

    async findByCategory(tutorId, category) {
        return Formula.find({ tutorId, category, deletedAt: null })
            .sort({ isFavorite: -1, title: 1 });
    }

    async findFavorites(tutorId) {
        return Formula.find({ tutorId, isFavorite: true, deletedAt: null })
            .sort({ title: 1 });
    }
}

export default new FormulaRepository();
