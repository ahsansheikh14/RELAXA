import { Router } from 'express';
import { getExercises } from '../controllers/exercise.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getExercises);

export default router;
