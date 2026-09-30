import { Router } from 'express';
import { register, login, getMe, updateProfile, reseedPlan } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/reseed', authenticate, reseedPlan);

export default router;
