import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { SleepCalculatorWidget } from '../components/sleep/SleepCalculatorWidget';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { DailyLog } from '../types';

export const SleepPage: React.FC = () => {
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
      console.error('Error fetching sleep:', err);
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
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Moon className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            NEUROLOGICAL RECOVERY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SLEEP TRACKER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Target 7.5h – 8.0h. High-quality sleep consolidates newly learned algorithms and concepts.
        </p>
      </div>

      {/* Sleep Calculator Widget */}
      <SleepCalculatorWidget
        sleptAt={dailyLog?.sleep?.sleptAt || '00:00'}
        wokeUpAt={dailyLog?.sleep?.wokeUpAt || '07:30'}
        durationMinutes={dailyLog?.sleep?.durationMinutes || 450}
        qualityRating={dailyLog?.sleep?.qualityRating || 4}
        notes={dailyLog?.sleep?.notes || ''}
        targetHours={user?.sleepTargetHours || 7.5}
        onSave={async (sleepData) => {
          const res = await api.put(`/daily-log/${selectedDate}/sleep`, sleepData);
          if (res.data.success && res.data.sleep) {
            setDailyLog((prev) => prev ? { ...prev, sleep: res.data.sleep } : null);
          }
          fetchLog();
        }}
      />
    </div>
  );
};
