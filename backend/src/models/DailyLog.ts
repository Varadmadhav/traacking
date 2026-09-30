import mongoose, { Document, Schema } from 'mongoose';

export interface IProteinEntry {
  id: string;
  grams: number;
  time?: string;
  label?: string;
}

export interface ITimetableBlockState {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  subLabel?: string;
  blockType?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;
}

export interface IDailyLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  sleep: {
    sleptAt?: string; // e.g. "23:45"
    wokeUpAt?: string; // e.g. "07:30"
    durationMinutes: number;
    qualityRating?: number; // 1-5
    notes?: string;
  };
  protein: {
    entries: IProteinEntry[];
    totalGrams: number;
    target: number;
  };
  steps: {
    count: number;
    target: number;
  };
  workout: {
    completed: boolean;
    workoutType: string; // Chest, Back, Legs, Shoulders, Arms, Rest, Other
    durationMinutes?: number;
    notes?: string;
  };
  phone: {
    totalMinutes: number;
    instagramMinutes?: number;
    youtubeMinutes?: number;
    otherMinutes?: number;
    targetMinutes: number;
    notes?: string;
  };
  habits: {
    gateTarget: boolean;
    pyqsDone: boolean;
    gymDone: boolean;
    steps10k: boolean;
    proteinTarget: boolean;
    sleepTarget: boolean;
    phoneUnderTarget: boolean;
    dailyReviewDone: boolean;
    customHabits: Array<{ name: string; done: boolean }>;
  };
  review: {
    wentWell: string;
    improveTomorrow: string;
    dailyScore: number;
    status: 'pending' | 'completed';
    completedAt?: Date;
  };
  dailyScoreBreakdown: {
    gate: number;
    studyConsistency: number;
    sleep: number;
    protein: number;
    gym: number;
    steps: number;
    phone: number;
    dailyReview: number;
    total: number;
  };
  timetableBlocks: ITimetableBlockState[];
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    sleep: {
      sleptAt: { type: String, default: '' },
      wokeUpAt: { type: String, default: '' },
      durationMinutes: { type: Number, default: 0 },
      qualityRating: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    },
    protein: {
      entries: [
        {
          id: { type: String, required: true },
          grams: { type: Number, required: true },
          time: { type: String, default: '' },
          label: { type: String, default: '' },
        },
      ],
      totalGrams: { type: Number, default: 0 },
      target: { type: Number, default: 120 },
    },
    steps: {
      count: { type: Number, default: 0 },
      target: { type: Number, default: 10000 },
    },
    workout: {
      completed: { type: Boolean, default: false },
      workoutType: { type: String, default: 'Rest' },
      durationMinutes: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    },
    phone: {
      totalMinutes: { type: Number, default: 0 },
      instagramMinutes: { type: Number, default: 0 },
      youtubeMinutes: { type: Number, default: 0 },
      otherMinutes: { type: Number, default: 0 },
      targetMinutes: { type: Number, default: 120 },
      notes: { type: String, default: '' },
    },
    habits: {
      gateTarget: { type: Boolean, default: false },
      pyqsDone: { type: Boolean, default: false },
      gymDone: { type: Boolean, default: false },
      steps10k: { type: Boolean, default: false },
      proteinTarget: { type: Boolean, default: false },
      sleepTarget: { type: Boolean, default: false },
      phoneUnderTarget: { type: Boolean, default: false },
      dailyReviewDone: { type: Boolean, default: false },
      customHabits: [
        {
          name: { type: String, required: true },
          done: { type: Boolean, default: false },
        },
      ],
    },
    review: {
      wentWell: { type: String, default: '' },
      improveTomorrow: { type: String, default: '' },
      dailyScore: { type: Number, default: 0 },
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
      completedAt: { type: Date },
    },
    dailyScoreBreakdown: {
      gate: { type: Number, default: 0 },
      studyConsistency: { type: Number, default: 0 },
      sleep: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      gym: { type: Number, default: 0 },
      steps: { type: Number, default: 0 },
      phone: { type: Number, default: 0 },
      dailyReview: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    timetableBlocks: [
      {
        id: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        label: { type: String, required: true },
        subLabel: { type: String, default: '' },
        blockType: { type: String, default: 'gate' },
        status: {
          type: String,
          enum: ['not_started', 'in_progress', 'completed', 'skipped'],
          default: 'not_started',
        },
        notes: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog = mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
