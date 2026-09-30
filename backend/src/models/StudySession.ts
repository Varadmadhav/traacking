import mongoose, { Document, Schema } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  subject: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  studyType: 'concept' | 'practice' | 'pyq' | 'revision' | 'mock';
  focusRating?: number; // 1-5
  difficultyRating?: number; // 1-5
  confidenceRating?: number; // 1-5
  notes?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema = new Schema<IStudySession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    topic: { type: String, default: '' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    studyType: {
      type: String,
      enum: ['concept', 'practice', 'pyq', 'revision', 'mock'],
      default: 'concept',
    },
    focusRating: { type: Number, min: 1, max: 5 },
    difficultyRating: { type: Number, min: 1, max: 5 },
    confidenceRating: { type: Number, min: 1, max: 5 },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StudySessionSchema.index({ userId: 1, date: 1 });
StudySessionSchema.index({ userId: 1, subject: 1 });

export const StudySession = mongoose.model<IStudySession>('StudySession', StudySessionSchema);
