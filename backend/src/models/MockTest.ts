import mongoose, { Document, Schema } from 'mongoose';

export interface IMockTest extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  date: string; // YYYY-MM-DD
  testType: 'Subject' | 'Multi-Subject' | 'Full-Length';
  subject?: string;
  totalMarks: number;
  score: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeTakenMinutes: number;
  mistakeBreakdown: {
    concept: number;
    application: number;
    calculation: number;
    time: number;
    selection: number;
    silly: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MockTestSchema = new Schema<IMockTest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    date: { type: String, required: true, index: true },
    testType: {
      type: String,
      enum: ['Subject', 'Multi-Subject', 'Full-Length'],
      default: 'Subject',
    },
    subject: { type: String, default: 'General' },
    totalMarks: { type: Number, default: 100 },
    score: { type: Number, required: true },
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeTakenMinutes: { type: Number, default: 180 },
    mistakeBreakdown: {
      concept: { type: Number, default: 0 },
      application: { type: Number, default: 0 },
      calculation: { type: Number, default: 0 },
      time: { type: Number, default: 0 },
      selection: { type: Number, default: 0 },
      silly: { type: Number, default: 0 },
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

MockTestSchema.index({ userId: 1, date: 1 });

export const MockTest = mongoose.model<IMockTest>('MockTest', MockTestSchema);
