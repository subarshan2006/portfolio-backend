import express from 'express';
import * as studentController from '../controllers/studentController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createStudentValidator,
    updateStudentValidator,
    studentIdValidator,
    statusValidator,
    searchValidator,
} from '../validators/studentValidator.js';

const router = express.Router();

// All routes are authenticated
router.use(authenticate);

router.get('/search', searchValidator, validate, studentController.searchStudents);
router.get('/', studentController.getAllStudents);
router.post('/', createStudentValidator, validate, studentController.createStudent);
router.get('/:id', [...studentIdValidator], validate, studentController.getStudentById);
router.put('/:id', [...studentIdValidator, ...updateStudentValidator], validate, studentController.updateStudent);
router.patch('/:id/status', [...studentIdValidator, ...statusValidator], validate, studentController.updateStudentStatus);
router.delete('/:id', [...studentIdValidator], validate, studentController.deleteStudent);
router.post('/:id/restore', [...studentIdValidator], validate, studentController.restoreStudent);

export default router;
