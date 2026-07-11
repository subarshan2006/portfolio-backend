import Student from '../models/Student.js';
import BaseRepository from './baseRepository.js';

class StudentRepository extends BaseRepository {
    constructor() {
        super(Student);
    }

    async findByTutor(tutorId, query = {}, sort = { createdAt: -1 }, skip = 0, limit = 10) {
        return Student.find({ tutorId, deletedAt: null, ...query })
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async countByTutor(tutorId, query = {}) {
        return Student.countDocuments({ tutorId, deletedAt: null, ...query });
    }

    async searchByTutor(tutorId, searchTerm, skip = 0, limit = 10) {
        return Student.find({
            tutorId,
            deletedAt: null,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { parentName: { $regex: searchTerm, $options: 'i' } },
                { parentEmail: { $regex: searchTerm, $options: 'i' } },
                { school: { $regex: searchTerm, $options: 'i' } },
            ],
        })
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);
    }

    async countSearchByTutor(tutorId, searchTerm) {
        return Student.countDocuments({
            tutorId,
            deletedAt: null,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { parentName: { $regex: searchTerm, $options: 'i' } },
                { parentEmail: { $regex: searchTerm, $options: 'i' } },
                { school: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    async findByIdAndTutor(studentId, tutorId) {
        return Student.findOne({ _id: studentId, tutorId, deletedAt: null });
    }

    async softDelete(studentId, tutorId) {
        return Student.findOneAndUpdate(
            { _id: studentId, tutorId },
            { deletedAt: new Date(), status: 'DROPPED' },
            { new: true }
        );
    }

    async restore(studentId, tutorId) {
        return Student.findOneAndUpdate(
            { _id: studentId, tutorId, deletedAt: { $ne: null } },
            { deletedAt: null, status: 'ACTIVE' },
            { new: true }
        );
    }

    async countActiveByTutor(tutorId) {
        return Student.countDocuments({ tutorId, status: 'ACTIVE', deletedAt: null });
    }

    async countByStatus(tutorId, status) {
        return Student.countDocuments({ tutorId, status, deletedAt: null });
    }

    async findByBirthdate(month, day) {
        return Student.find({
            deletedAt: null,
            dateOfBirth: { $exists: true, $ne: null },
        }).then((students) => {
            return students.filter((student) => {
                const dob = new Date(student.dateOfBirth);
                return dob.getMonth() + 1 === month && dob.getDate() === day;
            });
        });
    }

    async findStudentsWithUpcomingBirthdays(tutorId, daysAhead = 7) {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + daysAhead);

        return Student.find({
            tutorId,
            deletedAt: null,
            dateOfBirth: { $exists: true, $ne: null },
        }).then((students) => {
            return students.filter((student) => {
                const dob = new Date(student.dateOfBirth);
                const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                if (thisYearBirthday < today) {
                    thisYearBirthday.setFullYear(thisYearBirthday.getFullYear() + 1);
                }
                return thisYearBirthday >= today && thisYearBirthday <= futureDate;
            });
        });
    }
}

export default new StudentRepository();
