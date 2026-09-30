import mongoose, { Document, Schema } from 'mongoose';

export interface IPYQAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  subject: string;
  topic: string;
  year?: number;
  questionCode?: string;
  questionText?: string;
  questionType: 'MCQ' | 'MSQ' | 'NAT';
  marks: number;
  result: 'correct' | 'incorrect' | 'skipped';
  timeTakenSeconds: number;
  mistakeType: 'none' | 'concept' | 'calculation' | 'misread' | 'time' | 'guess' | 'silly_mistake';
  notes?: string;
  addedToErrorBook?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PYQAttemptSchema = new Schema<IPYQAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, default: '' },
    year: { type: Number },
    questionCode: { type: String, default: '' },
    questionText: { type: String, default: '' },
    questionType: { type: String, enum: ['MCQ', 'MSQ', 'NAT'], default: 'MCQ' },
    marks: { type: Number, default: 1 },
    result: { type: String, enum: ['correct', 'incorrect', 'skipped'], required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    mistakeType: {
      type: String,
      enum: ['none', 'concept', 'calculation', 'misread', 'time', 'guess', 'silly_mistake'],
      default: 'none',
    },
    notes: { type: String, default: '' },
    addedToErrorBook: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PYQAttemptSchema.index({ userId: 1, date: 1 });
PYQAttemptSchema.index({ userId: 1, subject: 1, topic: 1 });

export const PYQAttempt = mongoose.model<IPYQAttempt>('PYQAttempt', PYQAttemptSchema);
