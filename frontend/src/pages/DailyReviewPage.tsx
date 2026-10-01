import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Flame, ArrowRight, BookOpen, Clock, Moon, Dumbbell, Smartphone, Footprints } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { DailyLog, DashboardSummary } from '../types';

export const DailyReviewPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [wentWell, setWentWell] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/daily-log/dashboard-summary?date=${selectedDate}`);
      if (res.data.success && res.data.summary) {
        setSummary(res.data.summary);
        const rev = res.data.summary.dailyLog?.review;
        if (rev) {
          setWentWell(rev.wentWell || '');
          setImproveTomorrow(rev.improveTomorrow || '');
          if (rev.status === 'completed') {
            setSubmitted(true);
            setScoreResult(res.data.summary.progress.scoreBreakdown);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching review summary:', err);
    }
  };

  useEffect(() => {
    fetchSummary();

    const handleRefresh = () => fetchSummary();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [selectedDate]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post(`/daily-log/${selectedDate}/review`, {
        wentWell,
        improveTomorrow,
      });
      if (res.data.success) {
        setSubmitted(true);
        setScoreResult(res.data.breakdown);
        try {
          confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      alert('Error submitting daily review');
    }
    setSaving(false);
  };

  const p = summary?.progress;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            NIGHT DEBRIEF & EXECUTION AUDIT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          DAY COMPLETE // NIGHT REVIEW
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Daily Execution Score reflects disciplined daily consistency, not an exam prediction.
        </p>
      </div>

      {/* Automatic Daily Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-orange-400" /> GATE TOPICS
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {p?.topicsCompleted || 0} / {p?.totalTopics || 0}
          </span>
          <span className="text-[10px] font-mono text-orange-400">{p?.gatePercent || 0}% complete</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> STUDY HOURS
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {p?.studyHours || 0}h
          </span>
          <span className="text-[10px] font-mono text-slate-400">/ {p?.targetStudyHours || 7}h target</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" /> PROTEIN
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {p?.proteinGrams || 0}g
          </span>
          <span className="text-[10px] font-mono text-slate-400">/ {p?.targetProtein || 120}g</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Moon className="w-3 h-3 text-indigo-400" /> SLEEP DURATION
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {Math.floor((p?.sleepMinutes || 0) / 60)}h {(p?.sleepMinutes || 0) % 60}m
          </span>
          <span className="text-[10px] font-mono text-slate-400">Recovery</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Footprints className="w-3 h-3 text-emerald-400" /> STEPS
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {p?.stepsCount?.toLocaleString() || 0}
          </span>
          <span className="text-[10px] font-mono text-slate-400">/ 10,000</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-rose-400" /> GYM WORKOUT
          </span>
          <span className={`text-xl font-bold font-mono block mt-1 ${p?.workoutDone ? 'text-emerald-400' : 'text-slate-500'}`}>
            {p?.workoutDone ? 'DONE ✓' : 'MISSED'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">{p?.workoutType || 'Rest'}</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-sky-400" /> PHONE TIME
          </span>
          <span className="text-xl font-bold font-mono text-white block mt-1">
            {Math.floor((p?.phoneMinutes || 0) / 60)}h {(p?.phoneMinutes || 0) % 60}m
          </span>
          <span className="text-[10px] font-mono text-slate-400">Screen limit: 2h</span>
        </div>

        <div className="bg-gradient-to-br from-orange-950/40 to-amber-950/30 border border-orange-500/40 rounded-2xl p-4 shadow-glow-orange">
          <span className="text-[10px] font-mono text-orange-400 uppercase flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3" /> DAILY SCORE
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white block mt-1">
            {p?.dailyScore || 0}%
          </span>
          <span className="text-[10px] font-mono text-slate-300">Execution Score</span>
        </div>
      </div>

      {/* Execution Score Breakdown Pill List */}
      {scoreResult && (
        <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-3">
            WINTER ARC DAILY SCORE BREAKDOWN
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">GATE Execution (30%)</span>
              <span className="text-base font-bold font-mono text-orange-400">{scoreResult.gate}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Study Consistency (20%)</span>
              <span className="text-base font-bold font-mono text-amber-400">{scoreResult.studyConsistency}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Sleep (15%)</span>
              <span className="text-base font-bold font-mono text-indigo-400">{scoreResult.sleep}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Protein (10%)</span>
              <span className="text-base font-bold font-mono text-orange-400">{scoreResult.protein}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Gym (10%)</span>
              <span className="text-base font-bold font-mono text-rose-400">{scoreResult.gym}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Steps (5%)</span>
              <span className="text-base font-bold font-mono text-emerald-400">{scoreResult.steps}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Phone Discipline (5%)</span>
              <span className="text-base font-bold font-mono text-sky-400">{scoreResult.phone}%</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] font-mono text-slate-400 block">Daily Review (5%)</span>
              <span className="text-base font-bold font-mono text-emerald-400">{scoreResult.dailyReview}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Two Key Strategic Questions */}
      <form
        onSubmit={handleSubmitReview}
        className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 space-y-4 shadow-card-dark"
      >
        <h3 className="text-base font-bold text-white uppercase font-mono tracking-wide">
          DAILY REFLECTION
        </h3>

        <div>
          <label className="text-xs font-semibold text-emerald-400 block mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. What went well today? (Wins, breakthroughs, sharp focus sessions)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Mastered recursion tree method, strictly followed block 1 and 2 timetable, hit 120g protein seamlessly."
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-amber-400 block mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>2. What should improve tomorrow? (Frictions, distractions, schedule slips)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Start block 1 sharply at 8:30 without opening social media, drink more water during gym."
            value={improveTomorrow}
            onChange={(e) => setImproveTomorrow(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-dark-950 font-bold font-mono text-sm tracking-wider transition shadow-glow-orange flex items-center justify-center gap-2"
        >
          {saving ? 'RECORDING AUDIT...' : submitted ? 'UPDATE DAILY REVIEW' : 'COMPLETE DAY & LOG EXECUTION SCORE'}
        </button>
      </form>
    </div>
  );
};
