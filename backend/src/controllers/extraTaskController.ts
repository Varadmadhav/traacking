import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ExtraTask } from '../models/ExtraTask.js';

export const getExtraTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, category, status } = req.query;

    const query: any = { userId };
    if (date) query.date = date;
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;

    const tasks = await ExtraTask.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExtraTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { title, category, estimatedMinutes, actualMinutes, status, date, notes } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Task title is required.' });
      return;
    }

    const taskDate = date || new Date().toISOString().split('T')[0];
    const task = await ExtraTask.create({
      userId,
      date: taskDate,
      title,
      category: category || 'Personal',
      estimatedMinutes: Number(estimatedMinutes) || 30,
      actualMinutes: Number(actualMinutes) || 0,
      status: status || 'not_started',
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Extra task created.', task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExtraTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { title, category, estimatedMinutes, actualMinutes, status, notes } = req.body;

    const task = await ExtraTask.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title && { title }),
        ...(category && { category }),
        ...(estimatedMinutes !== undefined && { estimatedMinutes }),
        ...(actualMinutes !== undefined && { actualMinutes }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found.' });
      return;
    }

    res.json({ success: true, message: 'Extra task updated.', task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExtraTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    await ExtraTask.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Extra task deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
