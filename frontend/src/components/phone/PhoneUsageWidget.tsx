import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';

interface PhoneUsageWidgetProps {
  totalMinutes?: number;
  instagramMinutes?: number;
  youtubeMinutes?: number;
  otherMinutes?: number;
  targetMinutes?: number;
  notes?: string;
  onSave: (phoneData: {
    totalMinutes: number;
    instagramMinutes?: number;
    youtubeMinutes?: number;
    otherMinutes?: number;
    notes?: string;
  }) => Promise<void>;
}

export const PhoneUsageWidget: React.FC<PhoneUsageWidgetProps> = ({
  totalMinutes = 0,
  instagramMinutes = 0,
  youtubeMinutes = 0,
  otherMinutes = 0,
  targetMinutes = 120,
  notes = '',
  onSave,
}) => {
  const [hours, setHours] = useState(Math.floor(totalMinutes / 60));
  const [mins, setMins] = useState(totalMinutes % 60);
  const [igMins, setIgMins] = useState(instagramMinutes || 0);
  const [ytMins, setYtMins] = useState(youtubeMinutes || 0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state with updated props
  useEffect(() => {
    setHours(Math.floor(totalMinutes / 60));
    setMins(totalMinutes % 60);
    setIgMins(instagramMinutes || 0);
    setYtMins(youtubeMinutes || 0);
  }, [totalMinutes, instagramMinutes, youtubeMinutes]);

  const calculatedTotal = hours * 60 + mins;
  const targetHours = Number((targetMinutes / 60).toFixed(1));
  const diff = calculatedTotal - targetMinutes;

  let scoreLabel: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'HIGH' = 'GOOD';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let feedbackMessage = '';

  if (calculatedTotal <= targetMinutes * 0.75) {
    scoreLabel = 'EXCELLENT';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    feedbackMessage = `Great phone discipline! You spent ${hours}h ${mins}m, well under your ${targetHours}h target.`;
  } else if (calculatedTotal <= targetMinutes) {
    scoreLabel = 'GOOD';
    badgeColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    feedbackMessage = `Solid control. Phone usage was ${hours}h ${mins}m today, within your ${targetHours}h target.`;
  } else if (calculatedTotal <= targetMinutes + 60) {
    scoreLabel = 'MODERATE';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    const overH = Math.floor(diff / 60);
    const overM = diff % 60;
    feedbackMessage = `Phone usage was ${hours}h ${mins}m today. That's ${overH > 0 ? `${overH}h ` : ''}${overM}m above your target.`;
  } else {
    scoreLabel = 'HIGH';
    badgeColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    const overH = Math.floor(diff / 60);
    const overM = diff % 60;
    feedbackMessage = `Logged ${hours}h ${mins}m today (${overH > 0 ? `${overH}h ` : ''}${overM}m over target). Reset focus for tomorrow's blocks.`;
  }

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      totalMinutes: calculatedTotal,
      instagramMinutes: igMins,
      youtubeMinutes: ytMins,
      notes,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">PHONE DISCIPLINE</h3>
            <p className="text-xs text-slate-400">Target: Under {targetHours}h daily</p>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
          {scoreLabel}
        </span>
      </div>

      {/* Inputs */}
      <div className="bg-dark-950/80 rounded-xl p-4 border border-dark-800 mb-4">
        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
          TOTAL SCREEN TIME TODAY
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-850 rounded-lg p-2.5 border border-dark-700">
            <label className="text-xs text-slate-400 block mb-1">Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full bg-dark-950 text-xl font-mono font-bold text-white px-2.5 py-1 rounded border border-dark-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="bg-dark-850 rounded-lg p-2.5 border border-dark-700">
            <label className="text-xs text-slate-400 block mb-1">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={mins}
              onChange={(e) => setMins(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
              className="w-full bg-dark-950 text-xl font-mono font-bold text-white px-2.5 py-1 rounded border border-dark-700 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Constructive, non-guilt message */}
        <p className="text-xs text-slate-300 mt-3 italic bg-dark-900/60 p-2 rounded-lg border border-dark-800">
          {feedbackMessage}
        </p>
      </div>

      {/* Optional Breakdown toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
        >
          {showBreakdown ? 'Hide app breakdown' : '+ Add optional app breakdown (Instagram, YouTube)'}
        </button>

        {showBreakdown && (
          <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-dark-800">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Instagram (minutes)</label>
              <input
                type="number"
                min="0"
                value={igMins}
                onChange={(e) => setIgMins(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">YouTube (minutes)</label>
              <input
                type="number"
                min="0"
                value={ytMins}
                onChange={(e) => setYtMins(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-card-dark"
      >
        {savedSuccess ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>SAVED!</span>
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            <span>{isSaving ? 'SAVING...' : 'SAVE PHONE LOG'}</span>
          </>
        )}
      </button>
    </div>
  );
};
