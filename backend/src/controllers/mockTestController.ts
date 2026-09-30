import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { MockTest } from '../models/MockTest.js';

export const getMocks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const mocks = await MockTest.find({ userId }).sort({ date: -1 });

    const total = mocks.length;
    const avgScore = total > 0 ? Math.round(mocks.reduce((acc, m) => acc + m.score, 0) / total) : 0;
    const avgAccuracy = total > 0 ? Math.round(mocks.reduce((acc, m) => acc + m.accuracy, 0) / total) : 0;

    res.json({
      success: true,
      stats: { total, avgScore, avgAccuracy },
      mocks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const {
      title,
      date,
      testType,
      subject,
      totalMarks,
      score,
      attempted,
      correct,
      incorrect,
      timeTakenMinutes,
      mistakeBreakdown,
      notes,
    } = req.body;

    if (!title || score === undefined) {
      res.status(400).json({ success: false, message: 'Title and score are required.' });
      return;
    }

    const testDate = date || new Date().toISOString().split('T')[0];
    const totalM = Number(totalMarks) || 100;
    const userScore = Number(score);
    const att = Number(attempted) || 0;
    const corr = Number(correct) || 0;
    const accuracy = att > 0 ? Math.round((corr / att) * 100) : totalM > 0 ? Math.round((userScore / totalM) * 100) : 0;

    const mock = await MockTest.create({
      userId,
      title,
      date: testDate,
      testType: testType || 'Subject',
      subject: subject || 'General',
      totalMarks: totalM,
      score: userScore,
      attempted: att,
      correct: corr,
      incorrect: Number(incorrect) || (att > corr ? att - corr : 0),
      accuracy,
      timeTakenMinutes: Number(timeTakenMinutes) || 180,
      mistakeBreakdown: mistakeBreakdown || {
        concept: 0,
        application: 0,
        calculation: 0,
        time: 0,
        selection: 0,
        silly: 0,
      },
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Mock test logged.', mock });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    await MockTest.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Mock test deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
