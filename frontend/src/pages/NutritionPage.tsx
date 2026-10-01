import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { ProteinQuickTracker } from '../components/protein/ProteinQuickTracker';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { DailyLog } from '../types';

export const NutritionPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const { user } = useAuth();
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);

  const fetchLog = async () => {
    try {
      const res = await api.get(`/daily-log/${selectedDate}`);
      if (res.data.success && res.data.log) {
        setDailyLog(res.data.log);
      }
    } catch (err) {
      console.error('Error fetching protein:', err);
    }
  };

  useEffect(() => {
    fetchLog();

    const handleRefresh = () => fetchLog();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [selectedDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <Flame className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            MUSCLE RECOVERY & FUEL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          PROTEIN TRACKER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Daily target: {user?.proteinTarget || 120}g. Enter raw protein numbers without calorie database bloat.
        </p>
      </div>

      {/* Protein Tracker */}
      <ProteinQuickTracker
        entries={dailyLog?.protein?.entries || []}
        targetGrams={user?.proteinTarget || 120}
        onSave={async (entries, target) => {
          const res = await api.put(`/daily-log/${selectedDate}/protein`, { entries, target });
          if (res.data.success && res.data.protein) {
            setDailyLog((prev) => prev ? { ...prev, protein: res.data.protein } : null);
          }
          fetchLog();
        }}
      />
    </div>
  );
};
