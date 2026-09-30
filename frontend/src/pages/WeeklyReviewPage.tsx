import React, { useState, useEffect } from 'react';
import { format, subDays, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { CalendarRange, Trophy, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { WeeklyReview } from '../types';

export const WeeklyReviewPage: React.FC = () => {
  const { selectedDate } = useArcDate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-07');
  const [metrics, setMetrics] = useState<any>(null);
  const [winOfTheWeek, setWinOfTheWeek] = useState('');
  const [biggestWeakness, setBiggestWeakness] = useState('');
  const [nextWeekPriority, setNextWeekPriority] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to calculate week date ranges from Oct 1
  useEffect(() => {
    const startObj = new Date('2026-10-01');
    const s = addDays(startObj, (currentWeek - 1) * 7);
    const e = addDays(s, 6);
    const sStr = format(s, 'yyyy-MM-dd');
    const eStr = format(e, 'yyyy-MM-dd');
    setStartDate(sStr);
    setEndDate(eStr);
  }, [currentWeek]);

  const fetchWeekData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/weekly-reviews/metrics?startDate=${startDate}&endDate=${endDate}&weekNumber=${currentWeek}`);
      if (res.data.success) {
        setMetrics(res.data.metrics);
        if (res.data.savedReview) {
          const r = res.data.savedReview;
          setWinOfTheWeek(r.winOfTheWeek || '');
          setBiggestWeakness(r.biggestWeakness || '');
          setNextWeekPriority(r.nextWeekPriority || '');
          setGeneralNotes(r.generalNotes || '');
        } else {
          setWinOfTheWeek('');
          setBiggestWeakness('');
          setNextWeekPriority('');
          setGeneralNotes('');
        }
      }
    } catch (err) {
      console.error('Error fetching weekly review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchWeekData();
    }
  }, [startDate, endDate, currentWeek]);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/weekly-reviews/save', {
        weekNumber: currentWeek,
        startDate,
        endDate,
        metrics,
        winOfTheWeek,
        biggestWeakness,
        nextWeekPriority,
        generalNotes,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Error saving weekly review');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <CalendarRange className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              SUNDAY STRATEGIC DEBRIEF
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WEEKLY REVIEW // WEEK {currentWeek}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            {startDate} → {endDate} • 7-Day Performance & Adaptation
          </p>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-2 bg-dark-950 p-2 rounded-xl border border-dark-800 shrink-0">
          <button
            onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
            disabled={currentWeek === 1}
            className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 disabled:opacity-30 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 text-orange-400">
            WEEK {currentWeek} / 14
          </span>
          <button
            onClick={() => setCurrentWeek((w) => Math.min(14, w + 1))}
            disabled={currentWeek === 14}
            className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 disabled:opacity-30 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregated Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">STUDY HOURS</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.studyHours || 0}h
          </span>
          <span className="text-[10px] font-mono text-orange-400">Total Week Study</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">PYQS SOLVED</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.pyqsAttempted || 0}
          </span>
          <span className="text-[10px] font-mono text-sky-400">{metrics?.pyqAccuracy || 0}% accuracy</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">TOPICS COMPLETED</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.topicsCompleted || 0}
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Syllabus modules</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">REVISIONS DONE</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.revisionsDone || 0}
          </span>
          <span className="text-[10px] font-mono text-amber-400">Spaced recalls</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">AVG SLEEP</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {Math.floor((metrics?.avgSleepMinutes || 0) / 60)}h {(metrics?.avgSleepMinutes || 0) % 60}m
          </span>
          <span className="text-[10px] font-mono text-indigo-400">Nightly average</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">AVG PROTEIN</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.avgProteinGrams || 0}g
          </span>
          <span className="text-[10px] font-mono text-orange-400">Daily average</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">GYM SESSIONS</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {metrics?.gymDays || 0} / 7
          </span>
          <span className="text-[10px] font-mono text-rose-400">Workouts hit</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">AVG PHONE USAGE</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">
            {Math.floor((metrics?.avgPhoneMinutes || 0) / 60)}h {(metrics?.avgPhoneMinutes || 0) % 60}m
          </span>
          <span className="text-[10px] font-mono text-sky-400">Screen time</span>
        </div>
      </div>

      {/* Strategic Reflections Form */}
      <form
        onSubmit={handleSaveReview}
        className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 space-y-4 shadow-card-dark"
      >
        <h3 className="text-base font-bold text-white uppercase font-mono tracking-wide">
          STRATEGIC WEEKLY AUDIT
        </h3>

        <div>
          <label className="text-xs font-semibold text-emerald-400 block mb-1.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>WIN OF THE WEEK (Biggest breakthrough / subject milestone)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Mastered Dynamic Programming 0/1 Knapsack & solved 40 hard PYQs with 85% accuracy."
            value={winOfTheWeek}
            onChange={(e) => setWinOfTheWeek(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-rose-400 block mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>BIGGEST WEAKNESS / BOTTLENECK (What held back execution or speed)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Lost 1 hour on Friday due to late sleep. Need to be in bed strictly by midnight."
            value={biggestWeakness}
            onChange={(e) => setBiggestWeakness(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-amber-400 block mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>NEXT WEEK PRIORITY (The #1 non-negotiable standard)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Lock down Operating Systems memory management & complete all scheduled revisions on time."
            value={nextWeekPriority}
            onChange={(e) => setNextWeekPriority(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold font-mono text-xs sm:text-sm tracking-wider transition shadow-glow-orange flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-dark-950" />
              <span>SAVED WEEKLY AUDIT!</span>
            </>
          ) : (
            <span>{saving ? 'SAVING...' : 'SAVE WEEKLY REPORT'}</span>
          )}
        </button>
      </form>
    </div>
  );
};
