import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DailyLog, IDailyLog } from '../models/DailyLog.js';
import { GatePlanDay } from '../models/GatePlanDay.js';
import { StudySession } from '../models/StudySession.js';
import { PYQAttempt } from '../models/PYQAttempt.js';
import { RevisionItem } from '../models/RevisionItem.js';
import { ExtraTask } from '../models/ExtraTask.js';
import { DEFAULT_TIMETABLE_TEMPLATE } from '../data/masterPlanData.js';
import { calculateSleepMinutes } from '../utils/calc.js';

// Helper to calculate daily score breakdown
function computeDailyScore(
  gateTopicPercent: number,
  studyMinutes: number,
  targetStudyHours: number,
  sleepMinutes: number,
  targetSleepHours: number,
  proteinGrams: number,
  targetProtein: number,
  workoutDone: boolean,
  stepsCount: number,
  targetSteps: number,
  phoneMinutes: number,
  targetPhoneHours: number,
  reviewCompleted: boolean
) {
  // 1. GATE execution (30%)
  const gateScore = Math.min(100, Math.max(0, gateTopicPercent)) * 0.30;

  // 2. Study consistency (20%)
  const studyTargetMins = (targetStudyHours || 7) * 60;
  const studyRatio = studyTargetMins > 0 ? Math.min(1.2, studyMinutes / studyTargetMins) : 0;
  const studyScore = Math.min(100, studyRatio * 100) * 0.20;

  // 3. Sleep (15%) - Target ~7.5h (450m)
  const sleepTargetMins = (targetSleepHours || 7.5) * 60;
  let sleepRatio = 0;
  if (sleepMinutes >= sleepTargetMins - 60 && sleepMinutes <= sleepTargetMins + 90) {
    sleepRatio = 1.0;
  } else if (sleepMinutes > 0) {
    sleepRatio = Math.max(0.4, 1 - Math.abs(sleepMinutes - sleepTargetMins) / 300);
  }
  const sleepScore = Math.min(100, sleepRatio * 100) * 0.15;

  // 4. Protein (10%)
  const proteinRatio = targetProtein > 0 ? Math.min(1.0, proteinGrams / targetProtein) : 0;
  const proteinScore = (proteinRatio * 100) * 0.10;

  // 5. Gym (10%)
  const gymScore = (workoutDone ? 100 : 0) * 0.10;

  // 6. Steps (5%)
  const stepRatio = targetSteps > 0 ? Math.min(1.0, stepsCount / targetSteps) : 0;
  const stepsScore = (stepRatio * 100) * 0.05;

  // 7. Phone discipline (5%)
  const phoneTargetMins = (targetPhoneHours || 2) * 60;
  let phoneRatio = 1.0;
  if (phoneMinutes > phoneTargetMins) {
    const excess = phoneMinutes - phoneTargetMins;
    phoneRatio = Math.max(0, 1 - excess / 180);
  }
  const phoneScore = (phoneRatio * 100) * 0.05;

  // 8. Daily review (5%)
  const reviewScore = (reviewCompleted ? 100 : 0) * 0.05;

  const total = Math.round(
    gateScore + studyScore + sleepScore + proteinScore + gymScore + stepsScore + phoneScore + reviewScore
  );

  return {
    gate: Math.round(gateScore / 0.30),
    studyConsistency: Math.round(studyScore / 0.20),
    sleep: Math.round(sleepScore / 0.15),
    protein: Math.round(proteinScore / 0.10),
    gym: Math.round(gymScore / 0.10),
    steps: Math.round(stepsScore / 0.05),
    phone: Math.round(phoneScore / 0.05),
    dailyReview: Math.round(reviewScore / 0.05),
    total,
  };
}

export const getDailyLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params; // YYYY-MM-DD

    let log = await DailyLog.findOne({ userId, date });
    const dayPlan = await GatePlanDay.findOne({ userId, date });

    if (!log) {
      // Create fresh default log with timetable customized for today's GATE topics
      const timetableBlocks = DEFAULT_TIMETABLE_TEMPLATE.map((tb) => {
        let subLabel = '';
        if (dayPlan) {
          if (tb.id === 'tb-3') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block1 || dayPlan.topics.map((t) => t.name).slice(0, 2).join(', ')}`;
          if (tb.id === 'tb-5') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block2 || dayPlan.topics.map((t) => t.name).slice(2, 4).join(', ')}`;
          if (tb.id === 'tb-8') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block3 || dayPlan.dailyOutput}`;
          if (tb.id === 'tb-12') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block4 || dayPlan.pyqTarget}`;
        }

        return {
          id: tb.id,
          startTime: tb.startTime,
          endTime: tb.endTime,
          label: tb.label,
          subLabel,
          blockType: tb.blockType,
          status: 'not_started' as const,
          notes: '',
        };
      });

      log = await DailyLog.create({
        userId,
        date,
        protein: {
          entries: [
            { id: 'm1', grams: 0, time: '08:15', label: 'Meal 1' },
            { id: 'm2', grams: 0, time: '13:30', label: 'Meal 2' },
            { id: 'm3', grams: 0, time: '17:00', label: 'Meal 3' },
            { id: 'm4', grams: 0, time: '19:30', label: 'Meal 4' },
          ],
          totalGrams: 0,
          target: req.user!.proteinTarget || 120,
        },
        steps: {
          count: 0,
          target: req.user!.stepTarget || 10000,
        },
        phone: {
          totalMinutes: 0,
          targetMinutes: (req.user!.phoneTargetHours || 2) * 60,
        },
        timetableBlocks,
      });
    }

    res.json({ success: true, log, dayPlan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSleep = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { sleptAt, wokeUpAt, qualityRating, notes } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    const durationMinutes = calculateSleepMinutes(sleptAt, wokeUpAt);

    log.sleep = {
      sleptAt: sleptAt || '',
      wokeUpAt: wokeUpAt || '',
      durationMinutes,
      qualityRating: qualityRating || 0,
      notes: notes || '',
    };

    // Auto-update sleep habit if >= 7h
    log.habits.sleepTarget = durationMinutes >= (req.user!.sleepTargetHours || 7.5) * 60 - 30;

    await log.save();
    res.json({ success: true, message: 'Sleep updated.', sleep: log.sleep, durationMinutes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProtein = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { entries, target } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    let calculatedTotal = 0;
    const cleanEntries = (entries || []).map((e: any, index: number) => {
      const g = Number(e.grams) || 0;
      calculatedTotal += g;
      return {
        id: e.id || `entry-${index + 1}`,
        grams: g,
        time: e.time || '',
        label: e.label || `Meal ${index + 1}`,
      };
    });

    const targetGrams = target || req.user!.proteinTarget || 120;

    log.protein = {
      entries: cleanEntries,
      totalGrams: calculatedTotal,
      target: targetGrams,
    };

    log.habits.proteinTarget = calculatedTotal >= targetGrams;

    await log.save();
    res.json({ success: true, message: 'Protein updated.', protein: log.protein });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSteps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { count, target } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    const stepTarget = target || req.user!.stepTarget || 10000;
    const stepCount = Number(count) || 0;

    log.steps = {
      count: stepCount,
      target: stepTarget,
    };

    log.habits.steps10k = stepCount >= stepTarget;

    await log.save();
    res.json({ success: true, message: 'Steps updated.', steps: log.steps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { completed, workoutType, durationMinutes, notes } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    log.workout = {
      completed: Boolean(completed),
      workoutType: workoutType || 'Rest',
      durationMinutes: Number(durationMinutes) || 0,
      notes: notes || '',
    };

    log.habits.gymDone = Boolean(completed);

    await log.save();
    res.json({ success: true, message: 'Workout updated.', workout: log.workout });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePhone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { totalMinutes, instagramMinutes, youtubeMinutes, otherMinutes, targetMinutes, notes } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    const targetMins = targetMinutes || (req.user!.phoneTargetHours || 2) * 60;
    const totalMins = Number(totalMinutes) || 0;

    log.phone = {
      totalMinutes: totalMins,
      instagramMinutes: Number(instagramMinutes) || 0,
      youtubeMinutes: Number(youtubeMinutes) || 0,
      otherMinutes: Number(otherMinutes) || 0,
      targetMinutes: targetMins,
      notes: notes || '',
    };

    log.habits.phoneUnderTarget = totalMins <= targetMins;

    await log.save();
    res.json({ success: true, message: 'Phone usage updated.', phone: log.phone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { habits } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    log.habits = {
      ...log.habits,
      ...habits,
    };

    await log.save();
    res.json({ success: true, message: 'Habits updated.', habits: log.habits });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTimetableBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, blockId } = req.params;
    const { status, notes, subLabel } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    const blockIndex = log.timetableBlocks.findIndex((b) => b.id === blockId);
    if (blockIndex !== -1) {
      if (status) log.timetableBlocks[blockIndex].status = status;
      if (notes !== undefined) log.timetableBlocks[blockIndex].notes = notes;
      if (subLabel !== undefined) log.timetableBlocks[blockIndex].subLabel = subLabel;
    }

    await log.save();
    res.json({ success: true, message: 'Timetable block updated.', timetableBlocks: log.timetableBlocks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitDailyReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { wentWell, improveTomorrow } = req.body;

    let log = await DailyLog.findOne({ userId, date });
    if (!log) {
      log = new DailyLog({ userId, date });
    }

    const dayPlan = await GatePlanDay.findOne({ userId, date });
    const studySessions = await StudySession.find({ userId, date });
    const totalStudyMins = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    let gateTopicPercent = 0;
    if (dayPlan && dayPlan.topics.length > 0) {
      const completedCount = dayPlan.topics.filter((t) => t.status === 'completed').length;
      gateTopicPercent = Math.round((completedCount / dayPlan.topics.length) * 100);
    }

    const breakdown = computeDailyScore(
      gateTopicPercent,
      totalStudyMins,
      req.user!.studyTargetHours || 7,
      log.sleep.durationMinutes || 0,
      req.user!.sleepTargetHours || 7.5,
      log.protein.totalGrams || 0,
      req.user!.proteinTarget || 120,
      log.workout.completed || false,
      log.steps.count || 0,
      req.user!.stepTarget || 10000,
      log.phone.totalMinutes || 0,
      req.user!.phoneTargetHours || 2,
      true
    );

    log.review = {
      wentWell: wentWell || '',
      improveTomorrow: improveTomorrow || '',
      dailyScore: breakdown.total,
      status: 'completed',
      completedAt: new Date(),
    };

    log.dailyScoreBreakdown = breakdown;
    log.habits.dailyReviewDone = true;

    await log.save();

    res.json({
      success: true,
      message: 'Daily review submitted successfully. Execution score recorded.',
      review: log.review,
      breakdown: log.dailyScoreBreakdown,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const requestedDate = (req.query.date as string) || new Date().toISOString().split('T')[0];

    const user = req.user!;
    const startDate = user.startDate || '2026-10-01';
    const examDate = user.examDate || '2027-02-06';

    // Calculate dynamic countdown to exam date
    const todayObj = new Date(requestedDate);
    const examObj = new Date(examDate);
    const diffTime = examObj.getTime() - todayObj.getTime();
    const daysLeftToGate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Calculate Winter Arc Day Number
    const startObj = new Date(startDate);
    const arcDiff = todayObj.getTime() - startObj.getTime();
    const currentArcDay = Math.max(1, Math.floor(arcDiff / (1000 * 60 * 60 * 24)) + 1);

    // Fetch today's plan
    let dayPlan = await GatePlanDay.findOne({ userId, date: requestedDate });
    if (!dayPlan) {
      dayPlan = await GatePlanDay.findOne({ userId, dayNumber: currentArcDay });
    }

    // Fetch daily log (auto initialize if not found)
    let dailyLog = await DailyLog.findOne({ userId, date: requestedDate });
    if (!dailyLog) {
      const timetableBlocks = DEFAULT_TIMETABLE_TEMPLATE.map((tb) => {
        let subLabel = '';
        if (dayPlan) {
          if (tb.id === 'tb-3') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block1 || dayPlan.topics.map((t) => t.name).slice(0, 2).join(', ')}`;
          if (tb.id === 'tb-5') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block2 || dayPlan.topics.map((t) => t.name).slice(2, 4).join(', ')}`;
          if (tb.id === 'tb-8') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block3 || dayPlan.dailyOutput}`;
          if (tb.id === 'tb-12') subLabel = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block4 || dayPlan.pyqTarget}`;
        }

        return {
          id: tb.id,
          startTime: tb.startTime,
          endTime: tb.endTime,
          label: tb.label,
          subLabel,
          blockType: tb.blockType,
          status: 'not_started' as const,
          notes: '',
        };
      });

      dailyLog = await DailyLog.create({
        userId,
        date: requestedDate,
        protein: {
          entries: [
            { id: 'm1', grams: 0, time: '08:15', label: 'Meal 1' },
            { id: 'm2', grams: 0, time: '13:30', label: 'Meal 2' },
            { id: 'm3', grams: 0, time: '17:00', label: 'Meal 3' },
            { id: 'm4', grams: 0, time: '19:30', label: 'Meal 4' },
          ],
          totalGrams: 0,
          target: user.proteinTarget || 120,
        },
        steps: {
          count: 0,
          target: user.stepTarget || 10000,
        },
        phone: {
          totalMinutes: 0,
          targetMinutes: (user.phoneTargetHours || 2) * 60,
        },
        timetableBlocks,
      });
    }

    // Fetch study sessions for today
    const studySessions = await StudySession.find({ userId, date: requestedDate });
    const studyDurationMinutes = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // Fetch PYQ attempts for today
    const pyqAttempts = await PYQAttempt.find({ userId, date: requestedDate });
    const pyqCorrect = pyqAttempts.filter((p) => p.result === 'correct').length;

    // Fetch pending revisions due on or before today
    const dueRevisions = await RevisionItem.find({
      userId,
      dueDate: { $lte: requestedDate },
      status: 'pending',
    }).limit(10);

    // Fetch extra tasks for today
    const extraTasks = await ExtraTask.find({ userId, date: requestedDate });

    // Calculate current mission progress %
    let topicsCompleted = 0;
    let totalTopics = 0;
    if (dayPlan && dayPlan.topics) {
      totalTopics = dayPlan.topics.length;
      topicsCompleted = dayPlan.topics.filter((t) => t.status === 'completed').length;
    }
    const gatePercent = totalTopics > 0 ? Math.round((topicsCompleted / totalTopics) * 100) : 0;

    // Calculate live daily score
    const breakdown = computeDailyScore(
      gatePercent,
      studyDurationMinutes,
      user.studyTargetHours || 7,
      dailyLog?.sleep?.durationMinutes || 0,
      user.sleepTargetHours || 7.5,
      dailyLog?.protein?.totalGrams || 0,
      user.proteinTarget || 120,
      dailyLog?.workout?.completed || false,
      dailyLog?.steps?.count || 0,
      user.stepTarget || 10000,
      dailyLog?.phone?.totalMinutes || 0,
      user.phoneTargetHours || 2,
      dailyLog?.review?.status === 'completed'
    );

    res.json({
      success: true,
      summary: {
        currentDate: requestedDate,
        dayNumber: currentArcDay,
        totalArcDays: 99,
        daysLeftToGate,
        examDate,
        startDate,
        todayMission: dayPlan,
        progress: {
          gatePercent,
          topicsCompleted,
          totalTopics,
          studyHours: Number((studyDurationMinutes / 60).toFixed(1)),
          targetStudyHours: user.studyTargetHours || 7,
          studyMinutes: studyDurationMinutes,
          pyqsSolved: pyqAttempts.length,
          pyqsCorrect: pyqCorrect,
          sleepMinutes: dailyLog?.sleep?.durationMinutes || 0,
          proteinGrams: dailyLog?.protein?.totalGrams || 0,
          targetProtein: user.proteinTarget || 120,
          stepsCount: dailyLog?.steps?.count || 0,
          targetSteps: user.stepTarget || 10000,
          workoutDone: Boolean(dailyLog?.workout?.completed),
          workoutType: dailyLog?.workout?.workoutType || 'Rest',
          phoneMinutes: dailyLog?.phone?.totalMinutes || 0,
          targetPhoneMinutes: (user.phoneTargetHours || 2) * 60,
          dailyScore: breakdown.total,
          scoreBreakdown: breakdown,
        },
        dailyLog,
        studySessions,
        dueRevisions,
        extraTasks,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
