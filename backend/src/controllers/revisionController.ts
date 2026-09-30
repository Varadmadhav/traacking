import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { RevisionItem } from '../models/RevisionItem.js';

export const getRevisions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { status, date, subject, dueOnly } = req.query;

    const query: any = { userId };
    if (status && status !== 'all') query.status = status;
    if (subject && subject !== 'all') query.subject = subject;

    const todayStr = (date as string) || new Date().toISOString().split('T')[0];
    if (dueOnly === 'true') {
      query.dueDate = { $lte: todayStr };
      query.status = 'pending';
    }

    const revisions = await RevisionItem.find(query).sort({ dueDate: 1, revisionNumber: 1 });

    const dueCount = await RevisionItem.countDocuments({
      userId,
      dueDate: { $lte: todayStr },
      status: 'pending',
    });

    const completedCount = await RevisionItem.countDocuments({
      userId,
      status: 'completed',
    });

    res.json({
      success: true,
      stats: { dueCount, completedCount, total: revisions.length },
      revisions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { notes } = req.body;

    const revision = await RevisionItem.findOneAndUpdate(
      { _id: id, userId },
      {
        status: 'completed',
        completedAt: new Date(),
        ...(notes && { notes }),
      },
      { new: true }
    );

    if (!revision) {
      res.status(404).json({ success: false, message: 'Revision item not found.' });
      return;
    }

    res.json({ success: true, message: 'Revision marked as COMPLETED.', revision });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const snoozeRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { days = 1 } = req.body;

    const revision = await RevisionItem.findOne({ _id: id, userId });
    if (!revision) {
      res.status(404).json({ success: false, message: 'Revision item not found.' });
      return;
    }

    const currentDue = new Date(revision.dueDate);
    currentDue.setDate(currentDue.getDate() + Number(days));
    const newDueDate = currentDue.toISOString().split('T')[0];

    revision.dueDate = newDueDate;
    revision.status = 'snoozed';
    await revision.save();

    res.json({ success: true, message: `Revision snoozed to ${newDueDate}`, revision });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
