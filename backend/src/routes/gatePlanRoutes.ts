import { Router } from 'express';
import {
  getAllDays,
  getDayByDate,
  updateTopicStatus,
  updateDayNotes,
  getRoadmapSections,
} from '../controllers/gatePlanController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/days', getAllDays);
router.get('/days/:date', getDayByDate);
router.put('/days/:date/topics/:topicId', updateTopicStatus);
router.put('/days/:date/notes', updateDayNotes);
router.get('/roadmap', getRoadmapSections);

export default router;
