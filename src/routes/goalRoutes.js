import express from 'express';
import * as goalController from '../controllers/goalController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createGoalValidator,
    updateGoalValidator,
    goalIdValidator,
    goalQueryValidator,
} from '../validators/goalValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/upcoming', goalController.getUpcomingDeadlines);
router.get('/student/:studentId', goalController.getGoalsByStudent);
router.get('/', goalQueryValidator, validate, goalController.getAllGoals);
router.post('/', createGoalValidator, validate, goalController.createGoal);
router.get('/:id', [...goalIdValidator], validate, goalController.getGoalById);
router.put('/:id', [...goalIdValidator, ...updateGoalValidator], validate, goalController.updateGoal);
router.patch('/:id/complete', [...goalIdValidator], validate, goalController.completeGoal);
router.patch('/:id/progress', [...goalIdValidator], validate, goalController.updateGoalProgress);
router.delete('/:id', [...goalIdValidator], validate, goalController.deleteGoal);

export default router;
