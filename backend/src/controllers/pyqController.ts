import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { PYQAttempt } from '../models/PYQAttempt.js';
import { ErrorBook } from '../models/ErrorBook.js';

export const getAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, subject, result, topic } = req.query;

    const query: any = { userId };
    if (date) query.date = date;
    if (subject && subject !== 'all') query.subject = subject;
    if (result && result !== 'all') query.result = result;
    if (topic) query.topic = { $regex: topic, $options: 'i' };

    const attempts = await PYQAttempt.find(query).sort({ createdAt: -1 });
    const total = attempts.length;
    const correct = attempts.filter((a) => a.result === 'correct').length;
    const incorrect = attempts.filter((a) => a.result === 'incorrect').length;
    const skipped = attempts.filter((a) => a.result === 'skipped').length;
    const accuracy = total > 0 ? Math.round((correct / (total - skipped || 1)) * 100) : 0;

    res.json({
      success: true,
      stats: { total, correct, incorrect, skipped, accuracy },
      attempts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const {
      date,
      subject,
      topic,
      year,
      questionCode,
      questionText,
      questionType,
      marks,
      result,
      timeTakenSeconds,
      mistakeType,
      notes,
      whyWrong,
      correctConcept,
      whatToRemember,
    } = req.body;

    if (!subject || !result) {
      res.status(400).json({ success: false, message: 'Subject and result are required.' });
      return;
    }

    const sessionDate = date || new Date().toISOString().split('T')[0];
    const attempt = await PYQAttempt.create({
      userId,
      date: sessionDate,
      subject,
      topic: topic || '',
      year: year ? Number(year) : undefined,
      questionCode: questionCode || '',
      questionText: questionText || '',
      questionType: questionType || 'MCQ',
      marks: Number(marks) || 1,
      result,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      mistakeType: mistakeType || 'none',
      notes: notes || '',
      addedToErrorBook: result === 'incorrect',
    });

    // If incorrect, automatically add to Error Book
    if (result === 'incorrect') {
      await ErrorBook.create({
        userId,
        date: sessionDate,
        pyqAttemptId: attempt._id,
        question: questionText || questionCode || `${subject} - ${topic || 'PYQ'} (${year || 'Previous Year'})`,
        subject,
        topic: topic || '',
        year: year ? Number(year) : undefined,
        mistakeType: mistakeType || 'concept',
        whyWrong: whyWrong || notes || 'Identified mistake during practice',
        correctConcept: correctConcept || 'Review fundamental theory and correct calculation',
        whatToRemember: whatToRemember || 'Key formula/edge case to avoid repeat error',
        status: 'pending',
      });
    }

    res.status(201).json({
      success: true,
      message: result === 'incorrect' ? 'PYQ logged & added to Error Book' : 'PYQ logged successfully',
      attempt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getErrorBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { subject, mistakeType, status, search } = req.query;

    const query: any = { userId };
    if (subject && subject !== 'all') query.subject = subject;
    if (mistakeType && mistakeType !== 'all') query.mistakeType = mistakeType;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { whyWrong: { $regex: search, $options: 'i' } },
        { correctConcept: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await ErrorBook.find(query).sort({ createdAt: -1 });

    // Calculate mistake type breakdown
    const mistakeCounts: Record<string, number> = {
      concept: 0,
      calculation: 0,
      misread: 0,
      time: 0,
      guess: 0,
      silly_mistake: 0,
    };

    items.forEach((item) => {
      if (mistakeCounts[item.mistakeType] !== undefined) {
        mistakeCounts[item.mistakeType]++;
      }
    });

    res.json({
      success: true,
      count: items.length,
      mistakeCounts,
      items,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateErrorBookItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { status, whyWrong, correctConcept, whatToRemember, revisionDate } = req.body;

    const item = await ErrorBook.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(status && { status }),
        ...(whyWrong && { whyWrong }),
        ...(correctConcept && { correctConcept }),
        ...(whatToRemember && { whatToRemember }),
        ...(revisionDate && { revisionDate }),
      },
      { new: true }
    );

    if (!item) {
      res.status(404).json({ success: false, message: 'Error book entry not found.' });
      return;
    }

    res.json({ success: true, message: 'Error book entry updated.', item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteErrorBookItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    await ErrorBook.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Error book item deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
