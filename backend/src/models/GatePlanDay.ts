import mongoose, { Document, Schema } from 'mongoose';

export interface ITopicSubItem {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  notes?: string;
}

export interface IGatePlanDay extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 99
  dayName: string;
  primarySubject: string;
  topics: ITopicSubItem[];
  dailyOutput: string;
  estimatedHours: number;
  pyqTarget: string;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string;
  isCompleted: boolean;
  blockBreakdown?: {
    block1: string;
    block2: string;
    block3: string;
    block4: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TopicSubItemSchema = new Schema<ITopicSubItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    completedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const GatePlanDaySchema = new Schema<IGatePlanDay>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    dayNumber: { type: Number, required: true },
    dayName: { type: String, required: true },
    primarySubject: { type: String, required: true },
    topics: [TopicSubItemSchema],
    dailyOutput: { type: String, default: '' },
    estimatedHours: { type: Number, default: 7 },
    pyqTarget: { type: String, default: '' },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    notes: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    blockBreakdown: {
      block1: { type: String, default: '' },
      block2: { type: String, default: '' },
      block3: { type: String, default: '' },
      block4: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

GatePlanDaySchema.index({ userId: 1, date: 1 }, { unique: true });
GatePlanDaySchema.index({ userId: 1, dayNumber: 1 });

export const GatePlanDay = mongoose.model<IGatePlanDay>('GatePlanDay', GatePlanDaySchema);
