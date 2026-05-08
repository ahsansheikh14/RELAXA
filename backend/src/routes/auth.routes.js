import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  socialLogin,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/social-login', socialLogin);
router.post('/change-password', protect, changePassword);

export default router;
