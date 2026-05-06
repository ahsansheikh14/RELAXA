import { Router } from 'express';
import { adminLogin, getAllUsers, manageExercises } from '../controllers/admin.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/exercises', protect, adminOnly, manageExercises);

export default router;
