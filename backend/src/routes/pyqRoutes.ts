import { Router } from 'express';
import {
  getAttempts,
  createAttempt,
  getErrorBook,
  updateErrorBookItem,
  deleteErrorBookItem,
} from '../controllers/pyqController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/attempts', getAttempts);
router.post('/attempts', createAttempt);
router.get('/error-book', getErrorBook);
router.put('/error-book/:id', updateErrorBookItem);
router.delete('/error-book/:id', deleteErrorBookItem);

export default router;
