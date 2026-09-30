import mongoose, { Document, Schema } from 'mongoose';

export interface IErrorBook extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  pyqAttemptId?: mongoose.Types.ObjectId;
  question: string;
  subject: string;
  topic: string;
  year?: number;
  mistakeType: 'concept' | 'calculation' | 'misread' | 'time' | 'guess' | 'silly_mistake';
  whyWrong: string;
  correctConcept: string;
  whatToRemember: string;
  revisionDate?: string;
  status: 'pending' | 'reviewing' | 'mastered';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ErrorBookSchema = new Schema<IErrorBook>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    pyqAttemptId: { type: Schema.Types.ObjectId, ref: 'PYQAttempt' },
    question: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, default: '' },
    year: { type: Number },
    mistakeType: {
      type: String,
      enum: ['concept', 'calculation', 'misread', 'time', 'guess', 'silly_mistake'],
      default: 'concept',
    },
    whyWrong: { type: String, required: true },
    correctConcept: { type: String, required: true },
    whatToRemember: { type: String, required: true },
    revisionDate: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'mastered'],
      default: 'pending',
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ErrorBookSchema.index({ userId: 1, subject: 1 });
ErrorBookSchema.index({ userId: 1, status: 1 });

export const ErrorBook = mongoose.model<IErrorBook>('ErrorBook', ErrorBookSchema);
