import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { seedUserGatePlan } from '../services/seedService.js';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'winter_arc_secret_key_2026_gate_undeniable_token_secure_999';
  const expiresIn = process.env.JWT_EXPIRES_IN || '365d';
  return jwt.sign({ id: userId }, secret, { expiresIn: expiresIn as any });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, startDate, examDate } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      startDate: startDate || '2026-10-01',
      examDate: examDate || '2027-02-06',
    });

    // Auto-seed the 99-day GATE syllabus campaign
    await seedUserGatePlan(user._id);

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Winter Arc account created successfully. Plan initialized.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        startDate: user.startDate,
        examDate: user.examDate,
        proteinTarget: user.proteinTarget,
        stepTarget: user.stepTarget,
        studyTargetHours: user.studyTargetHours,
        sleepTargetHours: user.sleepTargetHours,
        phoneTargetHours: user.phoneTargetHours,
        workoutDaysPerWeek: user.workoutDaysPerWeek,
        theme: user.theme,
        hasSeededPlan: user.hasSeededPlan,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    // Ensure plan is seeded if somehow missed
    if (!user.hasSeededPlan) {
      await seedUserGatePlan(user._id);
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful. Welcome back to Winter Arc.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        startDate: user.startDate,
        examDate: user.examDate,
        proteinTarget: user.proteinTarget,
        stepTarget: user.stepTarget,
        studyTargetHours: user.studyTargetHours,
        sleepTargetHours: user.sleepTargetHours,
        phoneTargetHours: user.phoneTargetHours,
        workoutDaysPerWeek: user.workoutDaysPerWeek,
        theme: user.theme,
        hasSeededPlan: user.hasSeededPlan,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const {
      name,
      startDate,
      examDate,
      proteinTarget,
      stepTarget,
      studyTargetHours,
      sleepTargetHours,
      phoneTargetHours,
      workoutDaysPerWeek,
      theme,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (startDate) user.startDate = startDate;
    if (examDate) user.examDate = examDate;
    if (proteinTarget !== undefined) user.proteinTarget = proteinTarget;
    if (stepTarget !== undefined) user.stepTarget = stepTarget;
    if (studyTargetHours !== undefined) user.studyTargetHours = studyTargetHours;
    if (sleepTargetHours !== undefined) user.sleepTargetHours = sleepTargetHours;
    if (phoneTargetHours !== undefined) user.phoneTargetHours = phoneTargetHours;
    if (workoutDaysPerWeek !== undefined) user.workoutDaysPerWeek = workoutDaysPerWeek;
    if (theme) user.theme = theme;

    await user.save();

    res.json({
      success: true,
      message: 'Profile and targets updated successfully.',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reseedPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    await seedUserGatePlan(req.user._id);
    res.json({ success: true, message: 'GATE Master Plan re-imported successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
