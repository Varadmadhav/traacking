import { Router } from 'express';
import {
  getRevisions,
  completeRevision,
  snoozeRevision,
} from '../controllers/revisionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getRevisions);
router.put('/:id/complete', completeRevision);
router.put('/:id/snooze', snoozeRevision);

export default router;
