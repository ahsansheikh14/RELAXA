import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import moodRoutes from './mood.routes.js';
import exerciseRoutes from './exercise.routes.js';
import reportRoutes from './report.routes.js';
import aiRoutes from './ai.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Versioned API router. Keep paths consistent across teams.
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/moods', moodRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/reports', reportRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;
