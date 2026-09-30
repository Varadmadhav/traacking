import { Router } from 'express';
import {
  getWeeklyReviews,
  getOrGenerateWeekMetrics,
  saveWeeklyReview,
} from '../controllers/weeklyReviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getWeeklyReviews);
router.get('/metrics', getOrGenerateWeekMetrics);
router.post('/save', saveWeeklyReview);

export default router;
