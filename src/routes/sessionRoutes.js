import express from 'express';
import * as sessionController from '../controllers/sessionController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createSessionValidator,
    updateSessionValidator,
    statusValidator,
    attendanceValidator,
    rescheduleValidator,
    sessionIdValidator,
    sessionQueryValidator,
} from '../validators/sessionValidator.js';

const router = express.Router();

// All routes are authenticated
router.use(authenticate);

// Stats and special endpoints (must be before /:id routes)
router.get('/stats', sessionController.getSessionStats);
router.get('/today', sessionController.getTodaySessions);
router.get('/upcoming', sessionController.getUpcomingSessions);
router.get('/calendar/weekly', sessionController.getWeeklySchedule);
router.get('/calendar/monthly', sessionController.getMonthlySchedule);
router.get('/conflicts', sessionController.checkConflicts);

// CRUD
router.get('/', sessionQueryValidator, validate, sessionController.getAllSessions);
router.post('/', createSessionValidator, validate, sessionController.createSession);
router.get('/:id', [...sessionIdValidator], validate, sessionController.getSessionById);
router.put('/:id', [...sessionIdValidator, ...updateSessionValidator], validate, sessionController.updateSession);
router.patch('/:id/status', [...sessionIdValidator, ...statusValidator], validate, sessionController.updateSessionStatus);
router.patch('/:id/attendance', [...sessionIdValidator, ...attendanceValidator], validate, sessionController.markAttendance);
router.post('/:id/reschedule', [...sessionIdValidator, ...rescheduleValidator], validate, sessionController.rescheduleSession);
router.delete('/:id', [...sessionIdValidator], validate, sessionController.deleteSession);

// Sessions by student
router.get('/student/:studentId', sessionController.getSessionsByStudent);

export default router;
