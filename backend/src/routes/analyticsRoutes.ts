import { Router } from 'express';
import { getFullAnalytics } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getFullAnalytics);

export default router;
