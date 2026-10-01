import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { PhoneUsageWidget } from '../components/phone/PhoneUsageWidget';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { DailyLog } from '../types';

export const PhoneUsagePage: React.FC = () => {
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
      console.error('Error fetching phone usage:', err);
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
          <span className="p-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Smartphone className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            DIGITAL MINDFULNESS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          PHONE USAGE & SCREEN DISCIPLINE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Target: Under {user?.phoneTargetHours || 2} hours. Protect deep attention and avoid cognitive exhaustion.
        </p>
      </div>

      {/* Phone Widget */}
      <PhoneUsageWidget
        totalMinutes={dailyLog?.phone?.totalMinutes || 0}
        instagramMinutes={dailyLog?.phone?.instagramMinutes || 0}
        youtubeMinutes={dailyLog?.phone?.youtubeMinutes || 0}
        targetMinutes={(user?.phoneTargetHours || 2) * 60}
        notes={dailyLog?.phone?.notes || ''}
        onSave={async (phoneData) => {
          const res = await api.put(`/daily-log/${selectedDate}/phone`, phoneData);
          if (res.data.success && res.data.phone) {
            setDailyLog((prev) => prev ? { ...prev, phone: res.data.phone } : null);
          }
          fetchLog();
        }}
      />
    </div>
  );
};
