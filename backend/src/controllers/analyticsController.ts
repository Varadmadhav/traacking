import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { GatePlanDay } from '../models/GatePlanDay.js';
import { StudySession } from '../models/StudySession.js';
import { PYQAttempt } from '../models/PYQAttempt.js';
import { RevisionItem } from '../models/RevisionItem.js';
import { DailyLog } from '../models/DailyLog.js';
import { MockTest } from '../models/MockTest.js';

export const getFullAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    // 1. GATE Plan & Syllabus stats
    const allDays = await GatePlanDay.find({ userId });
    let totalTopics = 0;
    let completedTopics = 0;
    let inProgressTopics = 0;

    allDays.forEach((d) => {
      d.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'completed') completedTopics++;
        if (t.status === 'in_progress') inProgressTopics++;
      });
    });

    const syllabusPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const completedDaysCount = allDays.filter((d) => d.status === 'completed').length;

    // 2. PYQ Stats
    const pyqs = await PYQAttempt.find({ userId });
    const pyqTotal = pyqs.length;
    const pyqCorrect = pyqs.filter((p) => p.result === 'correct').length;
    const pyqIncorrect = pyqs.filter((p) => p.result === 'incorrect').length;
    const pyqAccuracy = pyqTotal > 0 ? Math.round((pyqCorrect / pyqTotal) * 100) : 0;

    // Subject-wise PYQ accuracy
    const subjectPyqs: Record<string, { total: number; correct: number; accuracy: number }> = {};
    pyqs.forEach((p) => {
      if (!subjectPyqs[p.subject]) {
        subjectPyqs[p.subject] = { total: 0, correct: 0, accuracy: 0 };
      }
      subjectPyqs[p.subject].total++;
      if (p.result === 'correct') subjectPyqs[p.subject].correct++;
    });

    Object.keys(subjectPyqs).forEach((subj) => {
      const item = subjectPyqs[subj];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    // 3. Revisions
    const revisions = await RevisionItem.find({ userId });
    const revTotal = revisions.length;
    const revCompleted = revisions.filter((r) => r.status === 'completed').length;
    const revCompletionRate = revTotal > 0 ? Math.round((revCompleted / revTotal) * 100) : 0;

    // 4. Study Hours & Subject Distribution
    const studySessions = await StudySession.find({ userId });
    const totalStudyMins = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalStudyHours = Number((totalStudyMins / 60).toFixed(1));

    const subjectHours: Record<string, number> = {};
    studySessions.forEach((s) => {
      const h = (s.durationMinutes || 0) / 60;
      subjectHours[s.subject] = Number(((subjectHours[s.subject] || 0) + h).toFixed(1));
    });

    const subjectDistribution = Object.entries(subjectHours).map(([name, hours]) => ({
      name,
      hours,
    }));

    // 5. Daily Logs (last 14 days and full heatmap)
    const allLogs = await DailyLog.find({ userId }).sort({ date: 1 });

    const recentLogs = allLogs.slice(-14);
    const dailyStudyTrend = recentLogs.map((l) => {
      // Find study mins for that day
      const dayMins = studySessions
        .filter((s) => s.date === l.date)
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
      return {
        date: l.date.slice(5), // MM-DD
        fullDate: l.date,
        studyHours: Number((dayMins / 60).toFixed(1)),
        targetHours: req.user!.studyTargetHours || 7,
        proteinGrams: l.protein?.totalGrams || 0,
        proteinTarget: req.user!.proteinTarget || 120,
        sleepHours: Number(((l.sleep?.durationMinutes || 0) / 60).toFixed(1)),
        sleepTargetHours: req.user!.sleepTargetHours || 7.5,
        steps: l.steps?.count || 0,
        stepTarget: req.user!.stepTarget || 10000,
        phoneHours: Number(((l.phone?.totalMinutes || 0) / 60).toFixed(1)),
        phoneTargetHours: req.user!.phoneTargetHours || 2,
        dailyScore: l.review?.dailyScore || 0,
      };
    });

    // 6. Habit Heatmap Data
    const habitHeatmap = allLogs.map((l) => ({
      date: l.date,
      dailyScore: l.review?.dailyScore || 0,
      habitsCompleted: Object.values(l.habits || {}).filter((v) => v === true).length,
      workoutDone: l.workout?.completed || false,
    }));

    // 7. Mock Tests
    const mocks = await MockTest.find({ userId }).sort({ date: 1 });

    // 8. GATE Readiness State calculation (never showing fake rank or predicted rank)
    let readinessScore = 0;
    // Weights: Syllabus (40%), PYQ Accuracy (25%), Revisions (15%), Consistency (20%)
    readinessScore += (syllabusPercent / 100) * 40;
    readinessScore += (pyqAccuracy / 100) * 25;
    readinessScore += (revCompletionRate / 100) * 15;
    const consistencyScore = allLogs.length > 0 ? (allLogs.filter((l) => (l.review?.dailyScore || 0) >= 70).length / allLogs.length) * 20 : 0;
    readinessScore += consistencyScore;

    let readinessStatus: 'NOT STARTED' | 'BUILDING' | 'ON TRACK' | 'STRONG PREPARATION' | 'EXAM READY' = 'NOT STARTED';
    if (readinessScore >= 85) readinessStatus = 'EXAM READY';
    else if (readinessScore >= 65) readinessStatus = 'STRONG PREPARATION';
    else if (readinessScore >= 40) readinessStatus = 'ON TRACK';
    else if (readinessScore >= 15 || completedTopics > 0) readinessStatus = 'BUILDING';

    res.json({
      success: true,
      readiness: {
        score: Math.round(readinessScore),
        status: readinessStatus,
        syllabusPercent,
        pyqAccuracy,
        revCompletionRate,
        consistencyScore: Math.round(consistencyScore),
      },
      gateSyllabus: {
        totalTopics,
        completedTopics,
        inProgressTopics,
        totalDays: allDays.length,
        completedDays: completedDaysCount,
        percent: syllabusPercent,
      },
      study: {
        totalHours: totalStudyHours,
        totalSessions: studySessions.length,
        subjectDistribution,
      },
      pyqs: {
        total: pyqTotal,
        correct: pyqCorrect,
        incorrect: pyqIncorrect,
        accuracy: pyqAccuracy,
        subjectAccuracy: subjectPyqs,
      },
      revisions: {
        total: revTotal,
        completed: revCompleted,
        rate: revCompletionRate,
      },
      trends: {
        dailyStudyTrend,
        habitHeatmap,
      },
      mocks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
