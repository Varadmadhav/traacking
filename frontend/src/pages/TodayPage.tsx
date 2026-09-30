import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { HeaderCountdown } from '../components/common/HeaderCountdown';
import { TopicStateCheckbox } from '../components/common/TopicStateCheckbox';
import { DailyTimetableTimeline } from '../components/timetable/DailyTimetableTimeline';
import { StudyTimerBar } from '../components/study/StudyTimerBar';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { GatePlanDay, DailyLog } from '../types';

export const TodayPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate, dayName, arcDayNumber } = useArcDate();
  const navigate = useNavigate();

  const [dayPlan, setDayPlan] = useState<GatePlanDay | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayData = async () => {
    try {
      const res = await api.get(`/daily-log/${selectedDate}`);
      if (res.data.success) {
        setDailyLog(res.data.log);
        setDayPlan(res.data.dayPlan);
      }
    } catch (err) {
      console.error('Error fetching today data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, [selectedDate]);

  const handleToggleTopic = async (
    topicId: string,
    nextStatus?: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ) => {
    try {
      const res = await api.put(`/gate-plan/days/${selectedDate}/topics/${topicId}`, {
        targetStatus: nextStatus,
        notes,
      });
      if (res.data.success && res.data.day) {
        setDayPlan(res.data.day);
      }
    } catch (err) {
      console.error('Error toggling topic:', err);
    }
  };

  const handleUpdateBlockStatus = async (
    blockId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped',
    notes?: string
  ) => {
    try {
      const res = await api.put(`/daily-log/${selectedDate}/timetable/${blockId}`, {
        status,
        notes,
      });
      if (res.data.success && dailyLog) {
        setDailyLog({ ...dailyLog, timetableBlocks: res.data.timetableBlocks });
      }
    } catch (err) {
      console.error('Error updating block:', err);
    }
  };

  const completedTopicsCount = dayPlan?.topics?.filter((t) => t.status === 'completed').length || 0;
  const totalTopicsCount = dayPlan?.topics?.length || 0;
  const gatePercent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <HeaderCountdown />

      {/* Focus Stopwatch */}
      <StudyTimerBar
        currentSubject={dayPlan?.primarySubject || 'GATE Study'}
        currentTopic={dayPlan?.topics?.[0]?.name || ''}
        onSessionLogged={() => fetchTodayData()}
      />

      {/* Mission Execution Box */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">
              DAY {dayPlan?.dayNumber || arcDayNumber} // MISSION
            </span>
            <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
              {dayPlan?.primarySubject || 'GATE CAMPAIGN'}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-orange-400 block">{gatePercent}% COMPLETE</span>
            <span className="text-[10px] font-mono text-slate-400">{completedTopicsCount}/{totalTopicsCount} topics</span>
          </div>
        </div>

        {/* Targets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs font-mono bg-dark-950/80 p-3 rounded-xl border border-dark-800">
          <div>
            <span className="text-slate-500 block">OUTPUT TARGET</span>
            <span className="text-orange-300 font-bold">{dayPlan?.dailyOutput || 'Topic questions'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">PYQ TARGET</span>
            <span className="text-slate-200 font-bold">{dayPlan?.pyqTarget || '30-40 PYQs'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block">EST. HOURS</span>
            <span className="text-slate-200 font-bold">{dayPlan?.estimatedHours || 7} hours</span>
          </div>
        </div>

        {/* 3-State Topics */}
        <div className="space-y-2 mb-4">
          {dayPlan?.topics?.map((topic) => (
            <TopicStateCheckbox
              key={topic.id}
              topic={topic}
              subject={dayPlan.primarySubject}
              onToggle={handleToggleTopic}
            />
          ))}
        </div>
      </div>

      {/* Today's Adaptive Timetable */}
      <DailyTimetableTimeline
        blocks={dailyLog?.timetableBlocks || []}
        dayPlan={dayPlan}
        onUpdateBlockStatus={handleUpdateBlockStatus}
      />
    </div>
  );
};
