import Student from '../models/Student.js';

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async findOne(query) {
        return this.model.findOne(query);
    }

    async find(query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return this.model.find(query).sort(sort).skip(skip).limit(limit);
    }

    async count(query = {}) {
        return this.model.countDocuments(query);
    }

    async updateById(id, updates) {
        return this.model.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }

    async deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }

    async aggregate(pipeline) {
        return this.model.aggregate(pipeline);
    }
}

export default BaseRepository;
