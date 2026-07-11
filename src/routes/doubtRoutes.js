import express from 'express';
import * as doubtController from '../controllers/doubtController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createDoubtValidator,
    updateDoubtValidator,
    doubtIdValidator,
    doubtQueryValidator,
} from '../validators/doubtValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/topic/:topic', doubtController.getDoubtsByTopic);
router.get('/student/:studentId', doubtController.getDoubtsByStudent);
router.get('/', doubtQueryValidator, validate, doubtController.getAllDoubts);
router.post('/', createDoubtValidator, validate, doubtController.createDoubt);
router.get('/:id', [...doubtIdValidator], validate, doubtController.getDoubtById);
router.put('/:id', [...doubtIdValidator, ...updateDoubtValidator], validate, doubtController.updateDoubt);
router.patch('/:id/answer', [...doubtIdValidator], validate, doubtController.answerDoubt);
router.patch('/:id/resolve', [...doubtIdValidator], validate, doubtController.resolveDoubt);
router.delete('/:id', [...doubtIdValidator], validate, doubtController.deleteDoubt);

export default router;
