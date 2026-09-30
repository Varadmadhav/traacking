import React, { useState } from 'react';
import { Settings, Save, RotateCcw, CheckCircle2, Flame, Moon, BookOpen, Smartphone, Footprints } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, updateUserTargets, reseedUserPlan } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [startDate, setStartDate] = useState(user?.startDate || '2026-10-01');
  const [examDate, setExamDate] = useState(user?.examDate || '2027-02-06');
  const [proteinTarget, setProteinTarget] = useState(user?.proteinTarget?.toString() || '120');
  const [stepTarget, setStepTarget] = useState(user?.stepTarget?.toString() || '10000');
  const [studyTargetHours, setStudyTargetHours] = useState(user?.studyTargetHours?.toString() || '7');
  const [sleepTargetHours, setSleepTargetHours] = useState(user?.sleepTargetHours?.toString() || '7.5');
  const [phoneTargetHours, setPhoneTargetHours] = useState(user?.phoneTargetHours?.toString() || '2');
  const [workoutDays, setWorkoutDays] = useState(user?.workoutDaysPerWeek?.toString() || '5');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [reseeding, setReseeding] = useState(false);
  const [reseedSuccess, setReseedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateUserTargets({
      name,
      startDate,
      examDate,
      proteinTarget: parseFloat(proteinTarget) || 120,
      stepTarget: parseInt(stepTarget, 10) || 10000,
      studyTargetHours: parseFloat(studyTargetHours) || 7,
      sleepTargetHours: parseFloat(sleepTargetHours) || 7.5,
      phoneTargetHours: parseFloat(phoneTargetHours) || 2,
      workoutDaysPerWeek: parseInt(workoutDays, 10) || 5,
    });
    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Re-import the exact 99-day GATE schedule from the master document?')) return;
    setReseeding(true);
    const ok = await reseedUserPlan();
    setReseeding(false);
    if (ok) {
      setReseedSuccess(true);
      setTimeout(() => setReseedSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            OPERATING PARAMETERS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          COMMAND CENTER SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure your Winter Arc daily benchmarks and dynamic countdown exam dates.
        </p>
      </div>

      {/* Target Config Form */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 space-y-5 shadow-card-dark"
      >
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-dark-800 pb-2">
          USER & EXAM DATES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Winter Arc Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">GATE 2027 Exam Date</label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-dark-800 pb-2 pt-2">
          DAILY EXECUTION BENCHMARKS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span>Study Hours Target</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={studyTargetHours}
              onChange={(e) => setStudyTargetHours(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 7 hours</span>
          </div>

          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Protein Target (g)</span>
            </label>
            <input
              type="number"
              value={proteinTarget}
              onChange={(e) => setProteinTarget(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 120 grams</span>
          </div>

          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sleep Target (hours)</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={sleepTargetHours}
              onChange={(e) => setSleepTargetHours(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 7.5 hours</span>
          </div>

          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step Target</span>
            </label>
            <input
              type="number"
              value={stepTarget}
              onChange={(e) => setStepTarget(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 10,000 steps</span>
          </div>

          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Phone Usage Limit (hours)</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={phoneTargetHours}
              onChange={(e) => setPhoneTargetHours(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 2 hours</span>
          </div>

          <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
            <label className="text-xs text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <span className="text-xs">🏋️</span>
              <span>Gym Days Per Week</span>
            </label>
            <input
              type="number"
              value={workoutDays}
              onChange={(e) => setWorkoutDays(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 5 days</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold font-mono text-xs sm:text-sm tracking-wider transition shadow-glow-orange flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-dark-950" />
              <span>TARGETS UPDATED SUCCESSFULLY!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'SAVING...' : 'SAVE BENCHMARK TARGETS'}</span>
            </>
          )}
        </button>
      </form>

      {/* Plan Reseed Utility */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">RE-IMPORT GATE 2027 MASTER PLAN</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset or refresh all 99 day-by-day syllabus records from the official campaign source.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReseed}
          disabled={reseeding}
          className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white text-xs font-mono font-bold border border-dark-700 transition flex items-center gap-2 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${reseeding ? 'animate-spin' : ''}`} />
          <span>{reseeding ? 'IMPORTING...' : reseedSuccess ? 'IMPORTED ✓' : 'RE-IMPORT SCHEDULE'}</span>
        </button>
      </div>
    </div>
  );
};
