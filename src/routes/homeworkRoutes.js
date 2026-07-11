import express from 'express';
import * as homeworkController from '../controllers/homeworkController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createHomeworkValidator,
    updateHomeworkValidator,
    homeworkIdValidator,
    homeworkQueryValidator,
} from '../validators/homeworkValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/overdue', homeworkController.getOverdueHomework);
router.get('/student/:studentId', homeworkController.getHomeworkByStudent);
router.get('/', homeworkQueryValidator, validate, homeworkController.getAllHomework);
router.post('/', createHomeworkValidator, validate, homeworkController.createHomework);
router.get('/:id', [...homeworkIdValidator], validate, homeworkController.getHomeworkById);
router.put('/:id', [...homeworkIdValidator, ...updateHomeworkValidator], validate, homeworkController.updateHomework);
router.patch('/:id/submit', [...homeworkIdValidator], validate, homeworkController.markSubmitted);
router.patch('/:id/grade', [...homeworkIdValidator], validate, homeworkController.gradeHomework);
router.delete('/:id', [...homeworkIdValidator], validate, homeworkController.deleteHomework);

export default router;
