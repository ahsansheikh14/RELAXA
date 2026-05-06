import { Router } from 'express';
import { createMoodEntry, getMoodHistory } from '../controllers/mood.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createMoodEntry);
router.get('/history', protect, getMoodHistory);

export default router;
