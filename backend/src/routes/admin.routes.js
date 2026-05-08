import { Router } from 'express';
import {
  adminLogin,
  getActivityMix,
  getAllUsers,
  getAnalyticsSummary,
  manageExercises,
} from '../controllers/admin.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/exercises', protect, adminOnly, manageExercises);
router.get('/analytics/summary', protect, adminOnly, getAnalyticsSummary);
router.get('/analytics/activity-mix', protect, adminOnly, getActivityMix);

export default router;
