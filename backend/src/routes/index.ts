import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gatePlanRoutes from './gatePlanRoutes.js';
import dailyLogRoutes from './dailyLogRoutes.js';
import studySessionRoutes from './studySessionRoutes.js';
import pyqRoutes from './pyqRoutes.js';
import revisionRoutes from './revisionRoutes.js';
import extraTaskRoutes from './extraTaskRoutes.js';
import weeklyReviewRoutes from './weeklyReviewRoutes.js';
import mockTestRoutes from './mockTestRoutes.js';
import noteRoutes from './noteRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/gate-plan', gatePlanRoutes);
router.use('/daily-log', dailyLogRoutes);
router.use('/study-sessions', studySessionRoutes);
router.use('/pyqs', pyqRoutes);
router.use('/revisions', revisionRoutes);
router.use('/extra-tasks', extraTaskRoutes);
router.use('/weekly-reviews', weeklyReviewRoutes);
router.use('/mock-tests', mockTestRoutes);
router.use('/notes', noteRoutes);
router.use('/analytics', analyticsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Winter Arc Tracker API',
    tagline: 'Execute every day. Become undeniable.',
  });
});

export default router;
