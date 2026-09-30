import { Router } from 'express';
import { getMocks, createMock, deleteMock } from '../controllers/mockTestController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getMocks);
router.post('/', createMock);
router.delete('/:id', deleteMock);

export default router;
