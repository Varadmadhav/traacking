import mongoose from 'mongoose';
import { GatePlanDay } from '../models/GatePlanDay.js';
import { User } from '../models/User.js';
import { RAW_99_DAY_PLAN, DEFAULT_TIMETABLE_TEMPLATE } from '../data/masterPlanData.js';

export const seedUserGatePlan = async (userId: mongoose.Types.ObjectId | string): Promise<boolean> => {
  try {
    const existingCount = await GatePlanDay.countDocuments({ userId });
    if (existingCount >= 99) {
      console.log(`[SeedService] User ${userId} already has ${existingCount} days seeded.`);
      return true;
    }

    // Delete any incomplete previous seed if fewer than 99
    if (existingCount > 0) {
      await GatePlanDay.deleteMany({ userId });
    }

    const daysToInsert = RAW_99_DAY_PLAN.map((day) => {
      const topicObjs = day.topics.map((topName, idx) => ({
        id: `topic-${day.dayNumber}-${idx + 1}`,
        name: topName,
        status: 'not_started' as const,
        notes: '',
      }));

      // Map topics nicely into the 4 GATE blocks
      const topicCount = day.topics.length;
      let b1 = day.topics.slice(0, Math.ceil(topicCount / 2)).join(', ');
      let b2 = day.topics.slice(Math.ceil(topicCount / 2)).join(', ') || day.topics[0] || 'Core concepts';
      let b3 = `${day.primarySubject} Practice (${day.dailyOutput || 'Topic questions'})`;
      let b4 = `${day.primarySubject} ${day.pyqTarget || 'PYQs & Error log'}`;

      const dateObj = new Date(day.date);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[dateObj.getDay()] || 'Day';

      return {
        userId,
        date: day.date,
        dayNumber: day.dayNumber,
        dayName,
        primarySubject: day.primarySubject,
        topics: topicObjs,
        dailyOutput: day.dailyOutput,
        estimatedHours: day.estimatedHours || 7,
        pyqTarget: day.pyqTarget || 'PYQs according to plan',
        status: 'not_started' as const,
        notes: '',
        isCompleted: false,
        blockBreakdown: {
          block1: b1,
          block2: b2,
          block3: b3,
          block4: b4,
        },
      };
    });

    await GatePlanDay.insertMany(daysToInsert);
    await User.findByIdAndUpdate(userId, { hasSeededPlan: true });

    console.log(`[SeedService] Successfully seeded 99 GATE days for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`[SeedService] Error seeding user GATE plan:`, error);
    throw error;
  }
};
