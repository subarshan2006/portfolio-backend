import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/monthly', dashboardController.getMonthlyOverview);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/performance', dashboardController.getStudentPerformanceOverview);

export default router;
