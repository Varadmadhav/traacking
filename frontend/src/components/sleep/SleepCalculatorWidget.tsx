import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Sparkles, CheckCircle } from 'lucide-react';

interface SleepCalculatorWidgetProps {
  sleptAt?: string;
  wokeUpAt?: string;
  durationMinutes?: number;
  qualityRating?: number;
  notes?: string;
  targetHours?: number;
  onSave: (sleepData: { sleptAt: string; wokeUpAt: string; qualityRating?: number; notes?: string }) => Promise<void>;
}

export const SleepCalculatorWidget: React.FC<SleepCalculatorWidgetProps> = ({
  sleptAt = '00:00',
  wokeUpAt = '07:30',
  durationMinutes = 450,
  qualityRating = 4,
  notes = '',
  targetHours = 7.5,
  onSave,
}) => {
  const [sleepTime, setSleepTime] = useState(sleptAt || '00:00');
  const [wakeTime, setWakeTime] = useState(wokeUpAt || '07:30');
  const [rating, setRating] = useState(qualityRating || 4);
  const [calculatedMins, setCalculatedMins] = useState(durationMinutes || 450);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-calculate duration whenever times change
  useEffect(() => {
    if (!sleepTime || !wakeTime) return;

    const parseToMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const sMin = parseToMins(sleepTime);
    const wMin = parseToMins(wakeTime);

    let diff = 0;
    if (wMin >= sMin) {
      diff = wMin - sMin;
    } else {
      diff = 1440 - sMin + wMin;
    }
    setCalculatedMins(diff);
  }, [sleepTime, wakeTime]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      sleptAt: sleepTime,
      wokeUpAt: wakeTime,
      qualityRating: rating,
      notes,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const hours = Math.floor(calculatedMins / 60);
  const mins = calculatedMins % 60;
  const targetMins = (targetHours || 7.5) * 60;

  let sleepStatus: 'LOW' | 'GOOD' | 'OPTIMAL' = 'GOOD';
  let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (calculatedMins >= 450 && calculatedMins <= 510) {
    sleepStatus = 'OPTIMAL';
    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (calculatedMins < 420) {
    sleepStatus = 'LOW';
    statusColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
  }

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">SLEEP TRACKER</h3>
            <p className="text-xs text-slate-400">Automatic duration & recovery scoring</p>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
          {sleepStatus}
        </span>
      </div>

      {/* Auto-calculated Large Result Display */}
      <div className="bg-dark-950/80 rounded-xl p-4 border border-dark-800 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            TOTAL SLEEP DURATION
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {hours}h {mins}m
            </span>
            <span className="text-xs font-medium text-slate-400">
              / {targetHours}h target
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">RECOVERY</span>
          <div className="text-sm font-semibold text-indigo-300 flex items-center gap-1 justify-end">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{Math.round((calculatedMins / targetMins) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Pickers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-dark-850 rounded-xl p-3 border border-dark-750">
          <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Slept at</span>
          </label>
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-dark-850 rounded-xl p-3 border border-dark-750">
          <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Woke up at</span>
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Quality Rating (1 to 5) */}
      <div className="mb-4">
        <label className="text-xs text-slate-400 block mb-1.5">Sleep Quality / Feeling upon waking</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                rating === num
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-glow-ice'
                  : 'bg-dark-850 text-slate-400 border-dark-750 hover:bg-dark-800'
              }`}
            >
              {num}★
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-card-dark"
      >
        {savedSuccess ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>SAVED!</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>{isSaving ? 'SAVING...' : 'SAVE SLEEP LOG'}</span>
          </>
        )}
      </button>
    </div>
  );
};
