import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { StudySession } from '../models/StudySession.js';

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, startDate, endDate, subject } = req.query;

    const query: any = { userId };
    if (date) query.date = date;
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };
    if (subject && subject !== 'all') query.subject = subject;

    const sessions = await StudySession.find(query).sort({ startTime: -1 });
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    res.json({
      success: true,
      count: sessions.length,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
      sessions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startTimerSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { subject, topic, studyType, date } = req.body;

    // Check if another session is active
    const activeSession = await StudySession.findOne({ userId, isActive: true });
    if (activeSession) {
      res.status(400).json({
        success: false,
        message: 'A study timer is already running. Stop it before starting a new one.',
        activeSession,
      });
      return;
    }

    const sessionDate = date || new Date().toISOString().split('T')[0];
    const session = await StudySession.create({
      userId,
      date: sessionDate,
      subject: subject || 'General GATE Study',
      topic: topic || '',
      studyType: studyType || 'concept',
      startTime: new Date(),
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Study timer started.', session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stopTimerSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { sessionId } = req.params;
    const { focusRating, difficultyRating, confidenceRating, notes } = req.body;

    const session = await StudySession.findOne({ _id: sessionId, userId });
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found.' });
      return;
    }

    const endTime = new Date();
    const durationMs = endTime.getTime() - new Date(session.startTime).getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

    session.endTime = endTime;
    session.durationMinutes = durationMinutes;
    session.isActive = false;
    if (focusRating) session.focusRating = focusRating;
    if (difficultyRating) session.difficultyRating = difficultyRating;
    if (confidenceRating) session.confidenceRating = confidenceRating;
    if (notes) session.notes = notes;

    await session.save();

    res.json({ success: true, message: 'Study timer stopped and logged.', session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logManualSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, subject, topic, durationMinutes, studyType, focusRating, difficultyRating, confidenceRating, notes } = req.body;

    if (!subject || !durationMinutes) {
      res.status(400).json({ success: false, message: 'Subject and duration are required.' });
      return;
    }

    const sessionDate = date || new Date().toISOString().split('T')[0];
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (Number(durationMinutes) || 0) * 60000);

    const session = await StudySession.create({
      userId,
      date: sessionDate,
      subject,
      topic: topic || '',
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes),
      studyType: studyType || 'concept',
      focusRating: focusRating || 4,
      difficultyRating: difficultyRating || 3,
      confidenceRating: confidenceRating || 4,
      notes: notes || '',
      isActive: false,
    });

    res.status(201).json({ success: true, message: 'Study session logged.', session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const session = await StudySession.findOne({ userId, isActive: true });
    res.json({ success: true, activeSession: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    await StudySession.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Session deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
