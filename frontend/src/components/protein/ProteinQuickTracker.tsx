import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Dumbbell, Zap, Flame } from 'lucide-react';
import { ProteinEntry } from '../../types';

interface ProteinQuickTrackerProps {
  entries: ProteinEntry[];
  targetGrams?: number;
  onSave: (entries: ProteinEntry[], target: number) => Promise<void>;
}

export const ProteinQuickTracker: React.FC<ProteinQuickTrackerProps> = ({
  entries = [],
  targetGrams = 120,
  onSave,
}) => {
  const [mealList, setMealList] = useState<ProteinEntry[]>(() => {
    if (entries && entries.length > 0) return entries;
    return [
      { id: 'm-1', grams: 0, label: 'Meal 1' },
      { id: 'm-2', grams: 0, label: 'Meal 2' },
      { id: 'm-3', grams: 0, label: 'Meal 3' },
      { id: 'm-4', grams: 0, label: 'Meal 4' },
    ];
  });

  // Sync state whenever parent passes updated entries (e.g. on fetch, date switch, quick action)
  useEffect(() => {
    if (entries && entries.length > 0) {
      setMealList(entries);
    } else {
      setMealList([
        { id: 'm-1', grams: 0, label: 'Meal 1' },
        { id: 'm-2', grams: 0, label: 'Meal 2' },
        { id: 'm-3', grams: 0, label: 'Meal 3' },
        { id: 'm-4', grams: 0, label: 'Meal 4' },
      ]);
    }
  }, [entries]);

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Real-time calculation
  const totalGrams = mealList.reduce((acc, m) => acc + (Number(m.grams) || 0), 0);
  const remaining = Math.max(0, targetGrams - totalGrams);
  const excess = Math.max(0, totalGrams - targetGrams);
  const progressPercent = Math.min(100, Math.round((totalGrams / targetGrams) * 100));

  const handleGramsChange = (id: string, val: string) => {
    const num = val === '' ? 0 : parseInt(val, 10) || 0;
    setMealList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, grams: num } : m))
    );
  };

  const handleAddMeal = () => {
    const nextIdx = mealList.length + 1;
    setMealList((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, grams: 0, label: `Meal ${nextIdx}` },
    ]);
  };

  const handleRemoveMeal = (id: string) => {
    if (mealList.length <= 1) return;
    setMealList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCalculateAndSave = async () => {
    setIsSaving(true);
    await onSave(mealList, targetGrams);
    setIsSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">PROTEIN TRACKER</h3>
            <p className="text-xs text-slate-400">Daily target: {targetGrams}g (Raw numeric input)</p>
          </div>
        </div>

        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
            totalGrams >= targetGrams
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
          }`}
        >
          {totalGrams >= targetGrams ? 'TARGET HIT ✓' : `${remaining}g REMAINING`}
        </span>
      </div>

      {/* Progress & Totals Card */}
      <div className="bg-dark-950/80 rounded-xl p-4 border border-dark-800 mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">CONSUMED TODAY</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                {totalGrams}g
              </span>
              <span className="text-xs font-medium text-slate-400">
                / {targetGrams}g
              </span>
            </div>
          </div>

          <div className="text-right">
            {excess > 0 ? (
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                +{excess}g OVER TARGET
              </span>
            ) : (
              <span className="text-xs font-mono text-slate-400 block">
                {remaining}g to go
              </span>
            )}
            <span className="text-lg font-bold font-mono text-orange-400">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalGrams >= targetGrams
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-orange-500 to-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Dynamic Meal Number Rows */}
      <div className="space-y-2.5 mb-4">
        {mealList.map((meal, idx) => (
          <div
            key={meal.id}
            className="flex items-center gap-3 bg-dark-850/80 rounded-xl p-2.5 sm:px-3.5 border border-dark-750 focus-within:border-orange-500/50 transition"
          >
            <span className="text-xs font-mono font-bold text-slate-400 w-16 sm:w-20 shrink-0">
              {meal.label || `Meal ${idx + 1}`}
            </span>

            <div className="flex-1 flex items-center gap-1.5 bg-dark-950 rounded-lg px-3 py-1.5 border border-dark-700">
              <input
                type="number"
                min="0"
                max="250"
                value={meal.grams === 0 ? '' : meal.grams}
                onChange={(e) => handleGramsChange(meal.id, e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-sm sm:text-base font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none"
              />
              <span className="text-xs font-mono text-slate-500">grams</span>
            </div>

            {mealList.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveMeal(meal.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Remove Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAddMeal}
          className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-xs font-semibold border border-dark-700 transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Entry</span>
        </button>

        <button
          type="button"
          onClick={handleCalculateAndSave}
          disabled={isSaving}
          className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-card-dark"
        >
          {justSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>SAVED! ({totalGrams}g)</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{isSaving ? 'CALCULATING...' : 'CALCULATE & SAVE'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
