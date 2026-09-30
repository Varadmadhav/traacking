import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Note } from '../models/Note.js';

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { subject, tag, search } = req.query;

    const query: any = { userId };
    if (subject && subject !== 'all') query.subject = subject;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    res.json({ success: true, count: notes.length, notes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { title, content, subject, topic, date, tags, isPinned } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Note title is required.' });
      return;
    }

    const note = await Note.create({
      userId,
      title,
      content: content || '',
      subject: subject || '',
      topic: topic || '',
      date: date || new Date().toISOString().split('T')[0],
      tags: tags || [],
      isPinned: Boolean(isPinned),
    });

    res.status(201).json({ success: true, message: 'Note created.', note });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const { title, content, subject, topic, tags, isPinned } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(subject !== undefined && { subject }),
        ...(topic !== undefined && { topic }),
        ...(tags && { tags }),
        ...(isPinned !== undefined && { isPinned }),
      },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ success: false, message: 'Note not found.' });
      return;
    }

    res.json({ success: true, message: 'Note updated.', note });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    await Note.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Note deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
