import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { GatePlanDay } from '../models/GatePlanDay.js';
import { RevisionItem } from '../models/RevisionItem.js';
import { PYQAttempt } from '../models/PYQAttempt.js';
import { GATE_10_ROADMAP_SECTIONS } from '../data/masterPlanData.js';
import { seedUserGatePlan } from '../services/seedService.js';

// Helper to add days to YYYY-MM-DD
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const getAllDays = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    let count = await GatePlanDay.countDocuments({ userId });
    if (count === 0) {
      await seedUserGatePlan(userId);
    }

    const { subject, status, month, search } = req.query;
    const query: any = { userId };

    if (subject && typeof subject === 'string' && subject !== 'all') {
      query.primarySubject = subject;
    }

    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    if (month && typeof month === 'string' && month !== 'all') {
      // e.g. "10" or "2026-10"
      query.date = { $regex: new RegExp(`-${month.padStart(2, '0')}-`) };
    }

    if (search && typeof search === 'string') {
      query.$or = [
        { primarySubject: { $regex: search, $options: 'i' } },
        { 'topics.name': { $regex: search, $options: 'i' } },
        { dailyOutput: { $regex: search, $options: 'i' } },
      ];
    }

    const days = await GatePlanDay.find(query).sort({ dayNumber: 1 });
    res.json({ success: true, count: days.length, days });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDayByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params; // YYYY-MM-DD

    let day = await GatePlanDay.findOne({ userId, date });
    if (!day) {
      // Check if plan needs seeding
      const count = await GatePlanDay.countDocuments({ userId });
      if (count === 0) {
        await seedUserGatePlan(userId);
        day = await GatePlanDay.findOne({ userId, date });
      }
    }

    if (!day) {
      res.status(404).json({ success: false, message: `No plan found for date ${date}` });
      return;
    }

    res.json({ success: true, day });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTopicStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date, topicId } = req.params;
    const { targetStatus, notes } = req.body; // 'not_started' | 'in_progress' | 'completed'

    const day = await GatePlanDay.findOne({ userId, date });
    if (!day) {
      res.status(404).json({ success: false, message: 'Day plan not found.' });
      return;
    }

    const topicIndex = day.topics.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) {
      res.status(404).json({ success: false, message: 'Topic not found in this day plan.' });
      return;
    }

    const topic = day.topics[topicIndex];
    const prevStatus = topic.status;

    // Cycle or set target status
    let nextStatus: 'not_started' | 'in_progress' | 'completed';
    if (targetStatus) {
      nextStatus = targetStatus;
    } else {
      if (prevStatus === 'not_started') nextStatus = 'in_progress';
      else if (prevStatus === 'in_progress') nextStatus = 'completed';
      else nextStatus = 'not_started';
    }

    topic.status = nextStatus;
    if (nextStatus === 'completed') {
      topic.completedAt = new Date();
    } else {
      topic.completedAt = undefined;
    }

    if (notes !== undefined) {
      topic.notes = notes;
    }

    // Update overall day status
    const totalTopics = day.topics.length;
    const completedTopics = day.topics.filter((t) => t.status === 'completed').length;
    const inProgressTopics = day.topics.filter((t) => t.status === 'in_progress').length;

    if (completedTopics === totalTopics && totalTopics > 0) {
      day.status = 'completed';
      day.isCompleted = true;
    } else if (completedTopics > 0 || inProgressTopics > 0) {
      day.status = 'in_progress';
      day.isCompleted = false;
    } else {
      day.status = 'not_started';
      day.isCompleted = false;
    }

    await day.save();

    // Spaced repetition generation when topic becomes completed
    if (nextStatus === 'completed' && prevStatus !== 'completed') {
      const intervals = [
        { num: 1, days: 1 },
        { num: 2, days: 7 },
        { num: 3, days: 21 },
        { num: 4, days: 45 },
      ];

      for (const inv of intervals) {
        const dueDate = addDays(date, inv.days);
        const existingRev = await RevisionItem.findOne({
          userId,
          topicName: topic.name,
          subject: day.primarySubject,
          revisionNumber: inv.num,
        });

        if (!existingRev) {
          await RevisionItem.create({
            userId,
            topicName: topic.name,
            subject: day.primarySubject,
            dayPlanId: day._id,
            revisionNumber: inv.num,
            dueDate,
            originalDate: date,
            status: 'pending',
          });
        }
      }
    }

    res.json({
      success: true,
      message: `Topic updated to ${nextStatus}`,
      topic,
      day,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDayNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { date } = req.params;
    const { notes } = req.body;

    const day = await GatePlanDay.findOneAndUpdate(
      { userId, date },
      { notes: notes || '' },
      { new: true }
    );

    if (!day) {
      res.status(404).json({ success: false, message: 'Day plan not found.' });
      return;
    }

    res.json({ success: true, message: 'Notes saved.', day });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoadmapSections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Fetch all user days
    const allDays = await GatePlanDay.find({ userId });
    const pyqs = await PYQAttempt.find({ userId });
    const revisions = await RevisionItem.find({ userId });

    const sectionsWithProgress = GATE_10_ROADMAP_SECTIONS.map((sec) => {
      // Find matching days for this subject
      const matchingDays = allDays.filter((d) => {
        const subj = d.primarySubject.toLowerCase();
        const secName = sec.name.toLowerCase();
        const shortName = sec.shortName.toLowerCase();

        if (sec.id === 'sec-1') {
          return subj.includes('math') || subj.includes('discrete');
        }
        if (sec.id === 'sec-2') {
          return subj.includes('digital');
        }
        if (sec.id === 'sec-3') {
          return subj.includes('coa') || subj.includes('architecture');
        }
        if (sec.id === 'sec-4') {
          return subj.includes('c programming') || subj.includes('data structures') || subj.includes('dsa');
        }
        if (sec.id === 'sec-5') {
          return subj.includes('algorithm');
        }
        if (sec.id === 'sec-6') {
          return subj.includes('toc') || subj.includes('computation');
        }
        if (sec.id === 'sec-7') {
          return subj.includes('compiler');
        }
        if (sec.id === 'sec-8') {
          return subj.includes('operating system');
        }
        if (sec.id === 'sec-9') {
          return subj.includes('dbms') || subj.includes('database');
        }
        if (sec.id === 'sec-10') {
          return subj.includes('network');
        }
        return false;
      });

      let totalTopics = 0;
      let completedTopics = 0;

      matchingDays.forEach((d) => {
        d.topics.forEach((t) => {
          totalTopics++;
          if (t.status === 'completed') completedTopics++;
        });
      });

      // Also count standard syllabus topics if days are empty
      if (totalTopics === 0) {
        totalTopics = sec.topics.length;
      }

      const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      // Filter PYQs for this section
      const sectionPYQs = pyqs.filter((p) => {
        const pSubj = (p.subject || '').toLowerCase();
        return pSubj.includes(sec.shortName.toLowerCase()) || pSubj.includes(sec.name.toLowerCase());
      });

      // Filter revisions completed
      const sectionRevs = revisions.filter((r) => {
        const rSubj = (r.subject || '').toLowerCase();
        return (rSubj.includes(sec.shortName.toLowerCase()) || rSubj.includes(sec.name.toLowerCase())) && r.status === 'completed';
      });

      let status: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Revision' = 'Not Started';
      if (progress === 100) {
        status = 'Completed';
      } else if (progress > 0) {
        status = 'In Progress';
      }

      return {
        ...sec,
        totalDaysAssigned: matchingDays.length,
        totalTopics,
        completedTopics,
        progress,
        pyqCount: sectionPYQs.length,
        revisionCount: sectionRevs.length,
        status,
        assignedDays: matchingDays.map((d) => ({
          date: d.date,
          dayNumber: d.dayNumber,
          primarySubject: d.primarySubject,
          status: d.status,
          topicsCount: d.topics.length,
          completedCount: d.topics.filter((t) => t.status === 'completed').length,
        })),
      };
    });

    res.json({ success: true, sections: sectionsWithProgress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
