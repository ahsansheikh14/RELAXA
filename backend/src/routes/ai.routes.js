import { Router } from 'express';
import {
  chatWithAssistant,
  getChatConversation,
  getRecommendations,
  listChatConversations,
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/recommendations', protect, getRecommendations);
router.get('/conversations', protect, listChatConversations);
router.get('/conversations/:conversationId', protect, getChatConversation);
router.post('/chat', protect, chatWithAssistant);

export default router;
