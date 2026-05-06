import { Router } from 'express';
import { chatWithAssistant, getRecommendations } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/recommendations', protect, getRecommendations);
router.post('/chat', protect, chatWithAssistant);

export default router;
