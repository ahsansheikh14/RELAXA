import { Router } from 'express';
import {
  adminLogin,
  forgotAdminPassword,
  getActivityMix,
  getAllUsers,
  deleteUser,
  getAnalyticsSummary,
  manageExercises,
} from '../controllers/admin.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', adminLogin);
router.post('/forgot-password', forgotAdminPassword);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:userId', protect, adminOnly, deleteUser);
router.post('/exercises', protect, adminOnly, manageExercises);
router.get('/analytics/summary', protect, adminOnly, getAnalyticsSummary);
router.get('/analytics/activity-mix', protect, adminOnly, getActivityMix);

export default router;
