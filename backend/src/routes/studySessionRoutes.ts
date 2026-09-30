import { Router } from 'express';
import {
  getSessions,
  startTimerSession,
  stopTimerSession,
  logManualSession,
  getActiveSession,
  deleteSession,
} from '../controllers/studySessionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSessions);
router.get('/active', getActiveSession);
router.post('/start', startTimerSession);
router.post('/stop/:sessionId', stopTimerSession);
router.post('/manual', logManualSession);
router.delete('/:id', deleteSession);

export default router;
