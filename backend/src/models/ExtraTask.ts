import mongoose, { Document, Schema } from 'mongoose';

export interface IExtraTask extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'College' | 'Career' | 'Coding' | 'Personal' | 'Family' | 'Other';
  estimatedMinutes: number;
  actualMinutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExtraTaskSchema = new Schema<IExtraTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['College', 'Career', 'Coding', 'Personal', 'Family', 'Other'],
      default: 'Personal',
    },
    estimatedMinutes: { type: Number, default: 30 },
    actualMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

ExtraTaskSchema.index({ userId: 1, date: 1 });

export const ExtraTask = mongoose.model<IExtraTask>('ExtraTask', ExtraTaskSchema);
