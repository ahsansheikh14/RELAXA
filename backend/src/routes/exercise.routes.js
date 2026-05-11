import { Router } from 'express';
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  getExercises,
  updateExercise,
} from '../controllers/exercise.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getExercises);
router.get('/:id', protect, getExerciseById);
router.post('/', protect, adminOnly, createExercise);
router.patch('/:id', protect, adminOnly, updateExercise);
router.delete('/:id', protect, adminOnly, deleteExercise);

export default router;
