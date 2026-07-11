import express from 'express';
import * as summaryController from '../controllers/summaryController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createSummaryValidator,
    updateSummaryValidator,
    summaryIdValidator,
    summaryQueryValidator,
} from '../validators/summaryValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', summaryQueryValidator, validate, summaryController.getAllSummaries);
router.get('/student/:studentId', summaryController.getStudentProgress);
router.get('/session/:sessionId', summaryController.getSummaryBySession);
router.get('/:id', [...summaryIdValidator], validate, summaryController.getSummaryById);
router.post('/session/:sessionId', createSummaryValidator, validate, summaryController.createSummary);
router.put('/:id', [...summaryIdValidator, ...updateSummaryValidator], validate, summaryController.updateSummary);
router.post('/:id/email', [...summaryIdValidator], validate, summaryController.emailSummary);
router.post('/email/resend-failed', summaryController.resendFailedEmails);

export default router;
