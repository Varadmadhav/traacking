import { Router } from 'express';
import {
  getDailyLog,
  updateSleep,
  updateProtein,
  updateSteps,
  updateWorkout,
  updatePhone,
  updateHabits,
  updateTimetableBlock,
  submitDailyReview,
  getDashboardSummary,
} from '../controllers/dailyLogController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard-summary', getDashboardSummary);
router.get('/:date', getDailyLog);
router.put('/:date/sleep', updateSleep);
router.put('/:date/protein', updateProtein);
router.put('/:date/steps', updateSteps);
router.put('/:date/workout', updateWorkout);
router.put('/:date/phone', updatePhone);
router.put('/:date/habits', updateHabits);
router.put('/:date/timetable/:blockId', updateTimetableBlock);
router.post('/:date/review', submitDailyReview);

export default router;
