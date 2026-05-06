import { Router } from 'express';
import { getMoodReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/mood-trends', protect, getMoodReport);

export default router;
