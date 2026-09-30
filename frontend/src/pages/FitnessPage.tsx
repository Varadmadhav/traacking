import React, { useState, useEffect } from 'react';
import { Dumbbell, Footprints, CheckCircle2, Flame, Trophy, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { DailyLog } from '../types';

export const FitnessPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const { user } = useAuth();
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);

  // Workout state
  const [workoutDone, setWorkoutDone] = useState(false);
  const [workoutType, setWorkoutType] = useState('Chest');
  const [workoutMins, setWorkoutMins] = useState(60);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Steps state
  const [stepCount, setStepCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchLog = async () => {
    try {
      const res = await api.get(`/daily-log/${selectedDate}`);
      if (res.data.success && res.data.log) {
        const log = res.data.log;
        setDailyLog(log);
        setWorkoutDone(Boolean(log.workout?.completed));
        setWorkoutType(log.workout?.workoutType || 'Chest');
        setWorkoutMins(log.workout?.durationMinutes || 60);
        setWorkoutNotes(log.workout?.notes || '');
        setStepCount(log.steps?.count || 0);
      }
    } catch (err) {
      console.error('Error fetching fitness data:', err);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [selectedDate]);

  const handleSaveWorkout = async () => {
    setSaving(true);
    try {
      await api.put(`/daily-log/${selectedDate}/workout`, {
        completed: workoutDone,
        workoutType,
        durationMinutes: workoutMins,
        notes: workoutNotes,
      });
      fetchLog();
    } catch (err) {
      alert('Error saving workout');
    }
    setSaving(false);
  };

  const handleSaveSteps = async () => {
    setSaving(true);
    try {
      await api.put(`/daily-log/${selectedDate}/steps`, {
        count: stepCount,
        target: user?.stepTarget || 10000,
      });
      fetchLog();
    } catch (err) {
      alert('Error saving steps');
    }
    setSaving(false);
  };

  const stepTarget = user?.stepTarget || 10000;
  const stepPercent = Math.min(100, Math.round((stepCount / stepTarget) * 100));

  const workoutOptions = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Push', 'Pull', 'Rest', 'Other'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Dumbbell className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
            PHYSICAL DISCIPLINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          FITNESS & 10K STEPS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Physical strength directly drives 8 hours of sharp cognitive endurance.
        </p>
      </div>

      {/* 10,000 Steps Tracker */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">DAILY STEPS</h3>
              <p className="text-xs text-slate-400">Target: {stepTarget.toLocaleString()} steps</p>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              stepCount >= stepTarget
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-dark-800 text-slate-400 border-dark-700'
            }`}
          >
            {stepCount >= stepTarget ? '10K HIT ✓' : `${Math.max(0, stepTarget - stepCount).toLocaleString()} to go`}
          </span>
        </div>

        {/* Input & Display */}
        <div className="bg-dark-950/80 rounded-xl p-4 border border-dark-800 mb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">ENTER STEPS</label>
              <input
                type="number"
                value={stepCount === 0 ? '' : stepCount}
                onChange={(e) => setStepCount(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-48 bg-dark-850 text-2xl sm:text-3xl font-mono font-black text-white px-3 py-1.5 rounded-xl border border-dark-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-emerald-400">{stepPercent}%</span>
              <span className="text-xs font-mono text-slate-400 block">/ {stepTarget.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stepPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSteps}
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-bold font-mono text-xs sm:text-sm tracking-wide transition shadow-card-dark"
        >
          {saving ? 'SAVING...' : 'SAVE STEPS'}
        </button>
      </div>

      {/* Gym Workout Tracker */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">GYM WORKOUT</h3>
              <p className="text-xs text-slate-400">Target: 5:30 PM – 7:00 PM</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWorkoutDone(!workoutDone)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition ${
              workoutDone
                ? 'bg-rose-500 text-white border-rose-400 shadow-glow-orange'
                : 'bg-dark-800 text-slate-400 border-dark-700'
            }`}
          >
            {workoutDone ? 'COMPLETED ✓' : 'NOT DONE'}
          </button>
        </div>

        {/* Workout Routine Selectors */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">Workout Focus</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {workoutOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWorkoutType(opt)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
                    workoutType === opt
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                      : 'bg-dark-850 text-slate-400 border-dark-750 hover:bg-dark-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={workoutMins}
                onChange={(e) => setWorkoutMins(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Workout Notes (optional)</label>
              <input
                type="text"
                placeholder="e.g. Heavy bench 80kg, incline DB press"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveWorkout}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs sm:text-sm tracking-wide transition shadow-card-dark"
          >
            {saving ? 'SAVING...' : 'SAVE WORKOUT LOG'}
          </button>
        </div>
      </div>
    </div>
  );
};
