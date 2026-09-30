import mongoose, { Document, Schema } from 'mongoose';

export interface IRevisionItem extends Document {
  userId: mongoose.Types.ObjectId;
  topicName: string;
  subject: string;
  dayPlanId?: mongoose.Types.ObjectId;
  revisionNumber: number; // 1 (+1d), 2 (+7d), 3 (+21d), 4 (+45d)
  dueDate: string; // YYYY-MM-DD
  originalDate: string; // YYYY-MM-DD
  status: 'pending' | 'completed' | 'snoozed';
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionItemSchema = new Schema<IRevisionItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topicName: { type: String, required: true },
    subject: { type: String, required: true },
    dayPlanId: { type: Schema.Types.ObjectId, ref: 'GatePlanDay' },
    revisionNumber: { type: Number, required: true },
    dueDate: { type: String, required: true, index: true },
    originalDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'snoozed'],
      default: 'pending',
      index: true,
    },
    completedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

RevisionItemSchema.index({ userId: 1, dueDate: 1, status: 1 });

export const RevisionItem = mongoose.model<IRevisionItem>('RevisionItem', RevisionItemSchema);
