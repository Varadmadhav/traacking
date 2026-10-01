import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Flame,
  Calendar,
  Sparkles,
  BookOpen,
  FileCheck2,
  Dumbbell,
  Footprints,
  Moon,
  Smartphone,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { DailyLog } from '../types';

export const HabitsPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [heatmapData, setHeatmapData] = useState<Array<{ date: string; dailyScore: number; habitsCompleted: number }>>([]);
  const [saving, setSaving] = useState(false);

  const fetchHabitsAndHeatmap = async () => {
    try {
      const logRes = await api.get(`/daily-log/${selectedDate}`);
      if (logRes.data.success) {
        setDailyLog(logRes.data.log);
      }

      const analyticsRes = await api.get('/analytics');
      if (analyticsRes.data.success && analyticsRes.data.trends?.habitHeatmap) {
        setHeatmapData(analyticsRes.data.trends.habitHeatmap);
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
    }
  };

  useEffect(() => {
    fetchHabitsAndHeatmap();

    const handleRefresh = () => fetchHabitsAndHeatmap();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [selectedDate]);

  const handleToggleHabit = async (habitKey: string) => {
    if (!dailyLog) return;
    const currentHabits = dailyLog.habits || {};
    const updatedHabits = {
      ...currentHabits,
      [habitKey]: !currentHabits[habitKey as keyof typeof currentHabits],
    };

    setDailyLog({
      ...dailyLog,
      habits: updatedHabits as any,
    });

    try {
      await api.put(`/daily-log/${selectedDate}/habits`, { habits: updatedHabits });
      fetchHabitsAndHeatmap();
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  const coreHabits = [
    { key: 'gateTarget', label: 'GATE Core Topics Target Completed', icon: BookOpen, desc: 'Covered all assigned topics for the day' },
    { key: 'pyqsDone', label: 'PYQs & Practice Solved', icon: FileCheck2, desc: 'Hit target question quota & logged accuracy' },
    { key: 'gymDone', label: 'Gym & Physical Workout', icon: Dumbbell, desc: 'Completed evening strength session' },
    { key: 'steps10k', label: '10,000 Steps Reached', icon: Footprints, desc: 'Maintained active recovery throughout the day' },
    { key: 'proteinTarget', label: '120g Protein Goal Hit', icon: Flame, desc: 'Adequate amino acid intake for brain and body' },
    { key: 'sleepTarget', label: '7.5h+ Optimal Sleep Target', icon: Moon, desc: 'Consistent circadian rhythm & full recovery' },
    { key: 'phoneUnderTarget', label: 'Phone Discipline (Under 2h)', icon: Smartphone, desc: 'Zero mindless scroll during core study blocks' },
    { key: 'dailyReviewDone', label: 'Night Execution Review Logged', icon: Sparkles, desc: 'Recorded wins and improvements for tomorrow' },
  ];

  const habitsObj = dailyLog?.habits || ({} as any);
  const completedCount = coreHabits.filter((h) => Boolean(habitsObj[h.key])).length;
  const progressPercent = Math.round((completedCount / coreHabits.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckSquare className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            DAILY PROTOCOL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          HABIT TRACKER & CONSISTENCY
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • {completedCount} of 8 core daily pillars locked in ({progressPercent}%).
        </p>
      </div>

      {/* Habits Checklist Grid */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-800">
          <h3 className="text-base font-bold text-white tracking-tight">8 CORE DAILY HABITS</h3>
          <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}% COMPLETE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coreHabits.map((habit) => {
            const isDone = Boolean(habitsObj[habit.key]);
            const Icon = habit.icon;
            return (
              <button
                key={habit.key}
                type="button"
                onClick={() => handleToggleHabit(habit.key)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-sm'
                    : 'bg-dark-850/80 border-dark-750 hover:border-dark-600 text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-dark-950 font-black'
                      : 'bg-dark-950 border-dark-700 text-transparent'
                  }`}
                >
                  ✓
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={`text-xs sm:text-sm font-bold truncate ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                      {habit.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{habit.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GitHub-Style Execution Heatmap */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h3 className="text-base font-bold text-white tracking-tight">EXECUTION HEATMAP</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Past days execution</span>
        </div>

        {heatmapData.length === 0 ? (
          <p className="text-xs text-slate-400 font-mono text-center py-6">
            Heatmap builds as you log your daily habits and night reviews!
          </p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 p-3 bg-dark-950/80 rounded-xl border border-dark-800">
              {heatmapData.map((day) => {
                const score = day.dailyScore || 0;
                let bg = 'bg-dark-800';
                if (score >= 85) bg = 'bg-emerald-500 shadow-glow-emerald';
                else if (score >= 70) bg = 'bg-emerald-600';
                else if (score >= 50) bg = 'bg-amber-500';
                else if (score > 0) bg = 'bg-orange-600';

                return (
                  <div
                    key={day.date}
                    title={`${day.date}: ${score}% Score (${day.habitsCompleted} habits)`}
                    className={`w-5 h-5 rounded-md ${bg} transition hover:scale-125 cursor-pointer`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] font-mono text-slate-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded bg-dark-800" />
              <div className="w-3 h-3 rounded bg-orange-600" />
              <div className="w-3 h-3 rounded bg-amber-500" />
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
