import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyReview extends Document {
  userId: mongoose.Types.ObjectId;
  weekNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  metrics: {
    studyHours: number;
    pyqsAttempted: number;
    pyqAccuracy: number;
    topicsCompleted: number;
    revisionsDone: number;
    avgSleepMinutes: number;
    avgProteinGrams: number;
    avgSteps: number;
    gymDays: number;
    avgPhoneMinutes: number;
    extraTasksDone: number;
  };
  winOfTheWeek: string;
  biggestWeakness: string;
  nextWeekPriority: string;
  generalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyReviewSchema = new Schema<IWeeklyReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weekNumber: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    metrics: {
      studyHours: { type: Number, default: 0 },
      pyqsAttempted: { type: Number, default: 0 },
      pyqAccuracy: { type: Number, default: 0 },
      topicsCompleted: { type: Number, default: 0 },
      revisionsDone: { type: Number, default: 0 },
      avgSleepMinutes: { type: Number, default: 0 },
      avgProteinGrams: { type: Number, default: 0 },
      avgSteps: { type: Number, default: 0 },
      gymDays: { type: Number, default: 0 },
      avgPhoneMinutes: { type: Number, default: 0 },
      extraTasksDone: { type: Number, default: 0 },
    },
    winOfTheWeek: { type: String, default: '' },
    biggestWeakness: { type: String, default: '' },
    nextWeekPriority: { type: String, default: '' },
    generalNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

WeeklyReviewSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });

export const WeeklyReview = mongoose.model<IWeeklyReview>('WeeklyReview', WeeklyReviewSchema);
