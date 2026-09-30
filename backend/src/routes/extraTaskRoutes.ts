import { Router } from 'express';
import {
  getExtraTasks,
  createExtraTask,
  updateExtraTask,
  deleteExtraTask,
} from '../controllers/extraTaskController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getExtraTasks);
router.post('/', createExtraTask);
router.put('/:id', updateExtraTask);
router.delete('/:id', deleteExtraTask);

export default router;
