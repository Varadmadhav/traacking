import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { WeeklyReview } from '../models/WeeklyReview.js';
import { StudySession } from '../models/StudySession.js';
import { PYQAttempt } from '../models/PYQAttempt.js';
import { GatePlanDay } from '../models/GatePlanDay.js';
import { RevisionItem } from '../models/RevisionItem.js';
import { DailyLog } from '../models/DailyLog.js';
import { ExtraTask } from '../models/ExtraTask.js';

export const getWeeklyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const reviews = await WeeklyReview.find({ userId }).sort({ weekNumber: -1 });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrGenerateWeekMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { startDate, endDate, weekNumber } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ success: false, message: 'startDate and endDate are required.' });
      return;
    }

    const sDate = startDate as string;
    const eDate = endDate as string;
    const wNum = Number(weekNumber) || 1;

    // Check existing review
    let review = await WeeklyReview.findOne({ userId, weekNumber: wNum });

    // Aggregate statistics across this 7-day range
    const studySessions = await StudySession.find({
      userId,
      date: { $gte: sDate, $lte: eDate },
    });
    const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const studyHours = Number((totalStudyMinutes / 60).toFixed(1));

    const pyqs = await PYQAttempt.find({
      userId,
      date: { $gte: sDate, $lte: eDate },
    });
    const pyqsAttempted = pyqs.length;
    const pyqsCorrect = pyqs.filter((p) => p.result === 'correct').length;
    const pyqAccuracy = pyqsAttempted > 0 ? Math.round((pyqsCorrect / pyqsAttempted) * 100) : 0;

    const days = await GatePlanDay.find({
      userId,
      date: { $gte: sDate, $lte: eDate },
    });
    let topicsCompleted = 0;
    days.forEach((d) => {
      topicsCompleted += d.topics.filter((t) => t.status === 'completed').length;
    });

    const revisions = await RevisionItem.find({
      userId,
      completedAt: { $gte: new Date(sDate), $lte: new Date(eDate + 'T23:59:59') },
      status: 'completed',
    });
    const revisionsDone = revisions.length;

    const dailyLogs = await DailyLog.find({
      userId,
      date: { $gte: sDate, $lte: eDate },
    });

    const daysCount = Math.max(1, dailyLogs.length);
    const totalSleepMins = dailyLogs.reduce((acc, l) => acc + (l.sleep?.durationMinutes || 0), 0);
    const avgSleepMinutes = Math.round(totalSleepMins / daysCount);

    const totalProteinGrams = dailyLogs.reduce((acc, l) => acc + (l.protein?.totalGrams || 0), 0);
    const avgProteinGrams = Math.round(totalProteinGrams / daysCount);

    const totalSteps = dailyLogs.reduce((acc, l) => acc + (l.steps?.count || 0), 0);
    const avgSteps = Math.round(totalSteps / daysCount);

    const gymDays = dailyLogs.filter((l) => l.workout?.completed).length;

    const totalPhoneMins = dailyLogs.reduce((acc, l) => acc + (l.phone?.totalMinutes || 0), 0);
    const avgPhoneMinutes = Math.round(totalPhoneMins / daysCount);

    const extraTasks = await ExtraTask.find({
      userId,
      date: { $gte: sDate, $lte: eDate },
      status: 'completed',
    });
    const extraTasksDone = extraTasks.length;

    const calculatedMetrics = {
      studyHours,
      pyqsAttempted,
      pyqAccuracy,
      topicsCompleted,
      revisionsDone,
      avgSleepMinutes,
      avgProteinGrams,
      avgSteps,
      gymDays,
      avgPhoneMinutes,
      extraTasksDone,
    };

    res.json({
      success: true,
      weekNumber: wNum,
      startDate: sDate,
      endDate: eDate,
      metrics: calculatedMetrics,
      savedReview: review,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveWeeklyReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { weekNumber, startDate, endDate, metrics, winOfTheWeek, biggestWeakness, nextWeekPriority, generalNotes } = req.body;

    const review = await WeeklyReview.findOneAndUpdate(
      { userId, weekNumber },
      {
        startDate,
        endDate,
        metrics,
        winOfTheWeek: winOfTheWeek || '',
        biggestWeakness: biggestWeakness || '',
        nextWeekPriority: nextWeekPriority || '',
        generalNotes: generalNotes || '',
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Weekly review saved.', review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
