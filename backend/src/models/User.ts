import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  startDate: string;
  examDate: string;
  proteinTarget: number;
  stepTarget: number;
  studyTargetHours: number;
  sleepTargetHours: number;
  phoneTargetHours: number;
  workoutDaysPerWeek: number;
  theme: string;
  hasSeededPlan: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    startDate: { type: String, default: '2026-10-01' },
    examDate: { type: String, default: '2027-02-06' },
    proteinTarget: { type: Number, default: 120 },
    stepTarget: { type: Number, default: 10000 },
    studyTargetHours: { type: Number, default: 7 },
    sleepTargetHours: { type: Number, default: 7.5 },
    phoneTargetHours: { type: Number, default: 2 },
    workoutDaysPerWeek: { type: Number, default: 5 },
    theme: { type: String, default: 'arc-dark' },
    hasSeededPlan: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
