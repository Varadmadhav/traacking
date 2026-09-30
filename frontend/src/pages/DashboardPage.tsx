import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  BookOpen,
  Clock,
  CheckCircle2,
  Dumbbell,
  Moon,
  Footprints,
  Smartphone,
  Sparkles,
  RotateCcw,
  Plus,
  ArrowRight,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { HeaderCountdown } from '../components/common/HeaderCountdown';
import { StatCard } from '../components/common/StatCard';
import { TopicStateCheckbox } from '../components/common/TopicStateCheckbox';
import { DailyTimetableTimeline } from '../components/timetable/DailyTimetableTimeline';
import { StudyTimerBar } from '../components/study/StudyTimerBar';
import { ProteinQuickTracker } from '../components/protein/ProteinQuickTracker';
import { SleepCalculatorWidget } from '../components/sleep/SleepCalculatorWidget';
import { PhoneUsageWidget } from '../components/phone/PhoneUsageWidget';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { DashboardSummary, GatePlanDay, DailyLog, RevisionItem, ExtraTask } from '../types';

export const DashboardPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate, dayName, arcDayNumber } = useArcDate();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dayPlan, setDayPlan] = useState<GatePlanDay | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [dueRevisions, setDueRevisions] = useState<RevisionItem[]>([]);
  const [extraTasks, setExtraTasks] = useState<ExtraTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/daily-log/dashboard-summary?date=${selectedDate}`);
      if (res.data.success && res.data.summary) {
        setSummary(res.data.summary);
        setDayPlan(res.data.summary.todayMission);
        setDailyLog(res.data.summary.dailyLog);
        setDueRevisions(res.data.summary.dueRevisions || []);
        setExtraTasks(res.data.summary.extraTasks || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen for quick action updates
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [selectedDate]);

  // Topic checkbox toggle handler
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
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error toggling topic:', err);
    }
  };

  // Timetable block status update
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
      console.error('Error updating timetable block:', err);
    }
  };

  // Revision complete / snooze
  const handleCompleteRevision = async (id: string) => {
    try {
      await api.put(`/revisions/${id}/complete`);
      setDueRevisions((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error completing revision:', err);
    }
  };

  const handleSnoozeRevision = async (id: string) => {
    try {
      await api.put(`/revisions/${id}/snooze`, { days: 1 });
      setDueRevisions((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error snoozing revision:', err);
    }
  };

  const p = summary?.progress;
  const completedTopicsCount = dayPlan?.topics?.filter((t) => t.status === 'completed').length || 0;
  const totalTopicsCount = dayPlan?.topics?.length || 0;
  const gatePercent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Dynamic Countdown */}
      <HeaderCountdown />

      {/* 2. Today's Progress Command Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">
            TODAY'S EXECUTION METRICS
          </h2>
          <span className="text-xs font-mono font-bold text-orange-400">
            DAILY SCORE: {p?.dailyScore || 0}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="GATE MISSION"
            value={`${gatePercent}%`}
            subValue={`${completedTopicsCount}/${totalTopicsCount} topics`}
            icon={BookOpen}
            colorScheme="orange"
            progress={gatePercent}
            onClick={() => navigate('/gate-plan')}
          />

          <StatCard
            label="STUDY TIME"
            value={`${p?.studyHours || 0}h`}
            subValue={`/ ${user?.studyTargetHours || 7}h target`}
            icon={Clock}
            colorScheme="amber"
            progress={((p?.studyMinutes || 0) / ((user?.studyTargetHours || 7) * 60)) * 100}
            onClick={() => navigate('/study')}
          />

          <StatCard
            label="PYQS SOLVED"
            value={p?.pyqsSolved || 0}
            subValue={`${p?.pyqsCorrect || 0} correct`}
            icon={CheckCircle2}
            colorScheme="blue"
            onClick={() => navigate('/pyqs')}
          />

          <StatCard
            label="SLEEP DURATION"
            value={`${Math.floor((p?.sleepMinutes || 0) / 60)}h ${(p?.sleepMinutes || 0) % 60}m`}
            subValue={`/ ${user?.sleepTargetHours || 7.5}h target`}
            icon={Moon}
            colorScheme="purple"
            onClick={() => navigate('/sleep')}
          />

          <StatCard
            label="PROTEIN CONSUMED"
            value={`${p?.proteinGrams || 0}g`}
            subValue={`/ ${user?.proteinTarget || 120}g`}
            icon={Flame}
            colorScheme="orange"
            progress={((p?.proteinGrams || 0) / (user?.proteinTarget || 120)) * 100}
            onClick={() => navigate('/nutrition')}
          />

          <StatCard
            label="STEPS"
            value={p?.stepsCount || 0}
            subValue={`/ ${user?.stepTarget || 10000}`}
            icon={Footprints}
            colorScheme="emerald"
            progress={((p?.stepsCount || 0) / (user?.stepTarget || 10000)) * 100}
            onClick={() => navigate('/fitness')}
          />

          <StatCard
            label="GYM WORKOUT"
            value={p?.workoutDone ? 'COMPLETED ✓' : 'PENDING'}
            subValue={p?.workoutType || 'Rest'}
            icon={Dumbbell}
            colorScheme={p?.workoutDone ? 'emerald' : 'slate'}
            onClick={() => navigate('/fitness')}
          />

          <StatCard
            label="PHONE USAGE"
            value={`${Math.floor((p?.phoneMinutes || 0) / 60)}h ${(p?.phoneMinutes || 0) % 60}m`}
            subValue={`/ ${user?.phoneTargetHours || 2}h limit`}
            icon={Smartphone}
            colorScheme={(p?.phoneMinutes || 0) <= (user?.phoneTargetHours || 2) * 60 ? 'emerald' : 'rose'}
            onClick={() => navigate('/phone-usage')}
          />
        </div>
      </div>

      {/* 3. Live Study Stopwatch Bar */}
      <StudyTimerBar
        currentSubject={dayPlan?.primarySubject || 'C Programming'}
        currentTopic={dayPlan?.topics?.[0]?.name || ''}
        onSessionLogged={() => fetchDashboardData()}
      />

      {/* 4. Desktop 2-Column Grid: Today's Mission (Left) & Timetable (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols on LG): Today's Mission */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mission Card */}
          <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">
                  TODAY'S MISSION // DAY {dayPlan?.dayNumber || arcDayNumber}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight uppercase">
                  {dayPlan?.primarySubject || 'GATE CAMPAIGN'}
                </h3>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                {gatePercent}% DONE
              </span>
            </div>

            {/* Target info badge */}
            <div className="bg-dark-950/80 rounded-xl p-3 border border-dark-800 mb-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Daily Output:</span>
                <span className="font-semibold text-orange-300">{dayPlan?.dailyOutput || 'Topic questions + PYQs'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">PYQ Target:</span>
                <span className="font-semibold text-slate-200">{dayPlan?.pyqTarget || '30-40 Questions'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated GATE Study:</span>
                <span className="font-semibold text-slate-200">{dayPlan?.estimatedHours || 7} hours</span>
              </div>
            </div>

            {/* Topics 3-State Checkbox List */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>ASSIGNED SYLLABUS TOPICS</span>
                <span>{completedTopicsCount} / {totalTopicsCount} COMPLETE</span>
              </div>

              {dayPlan?.topics?.map((topic) => (
                <TopicStateCheckbox
                  key={topic.id}
                  topic={topic}
                  subject={dayPlan.primarySubject}
                  onToggle={handleToggleTopic}
                />
              ))}
            </div>

            {/* Day Plan Notes */}
            {dayPlan?.notes && (
              <div className="mt-3 p-3 rounded-xl bg-dark-850 border border-dark-750 text-xs text-slate-300">
                <span className="font-bold text-orange-400 block mb-0.5">Day Notes:</span>
                {dayPlan.notes}
              </div>
            )}
          </div>

          {/* Spaced Revisions Due Today Widget */}
          {dueRevisions.length > 0 && (
            <div className="rounded-2xl bg-dark-900/90 border border-amber-500/30 p-4 sm:p-5 shadow-card-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white font-mono uppercase">
                    REVISIONS DUE TODAY ({dueRevisions.length})
                  </h4>
                </div>
                <button
                  onClick={() => navigate('/revisions')}
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {dueRevisions.map((rev) => (
                  <div
                    key={rev._id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950 border border-dark-750"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <span className="text-xs font-bold text-white block truncate">{rev.topicName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rev.subject} • Rev #{rev.revisionNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCompleteRevision(rev._id)}
                        className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-dark-950 text-[10px] font-bold font-mono transition"
                      >
                        DONE
                      </button>
                      <button
                        onClick={() => handleSnoozeRevision(rev._id)}
                        className="px-2 py-1 rounded bg-dark-800 hover:bg-dark-750 text-slate-300 text-[10px] font-mono transition"
                      >
                        SNOOZE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Trackers: Protein & Sleep */}
          <ProteinQuickTracker
            entries={dailyLog?.protein?.entries || []}
            targetGrams={user?.proteinTarget || 120}
            onSave={async (entries, target) => {
              await api.put(`/daily-log/${selectedDate}/protein`, { entries, target });
              fetchDashboardData();
            }}
          />

          <SleepCalculatorWidget
            sleptAt={dailyLog?.sleep?.sleptAt || '00:00'}
            wokeUpAt={dailyLog?.sleep?.wokeUpAt || '07:30'}
            durationMinutes={dailyLog?.sleep?.durationMinutes || 450}
            qualityRating={dailyLog?.sleep?.qualityRating || 4}
            notes={dailyLog?.sleep?.notes || ''}
            targetHours={user?.sleepTargetHours || 7.5}
            onSave={async (sleepData) => {
              await api.put(`/daily-log/${selectedDate}/sleep`, sleepData);
              fetchDashboardData();
            }}
          />

          <PhoneUsageWidget
            totalMinutes={dailyLog?.phone?.totalMinutes || 0}
            instagramMinutes={dailyLog?.phone?.instagramMinutes || 0}
            youtubeMinutes={dailyLog?.phone?.youtubeMinutes || 0}
            targetMinutes={(user?.phoneTargetHours || 2) * 60}
            notes={dailyLog?.phone?.notes || ''}
            onSave={async (phoneData) => {
              await api.put(`/daily-log/${selectedDate}/phone`, phoneData);
              fetchDashboardData();
            }}
          />
        </div>

        {/* Right Column (7 Cols on LG): Exact Timetable & Night Review Banner */}
        <div className="lg:col-span-7 space-y-6">
          <DailyTimetableTimeline
            blocks={dailyLog?.timetableBlocks || []}
            dayPlan={dayPlan}
            onUpdateBlockStatus={handleUpdateBlockStatus}
          />

          {/* Night Review Action Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-orange-950/30 via-dark-900 to-dark-900 border border-orange-500/30 p-5 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold tracking-wider text-orange-400 uppercase">
                  NIGHT REFLECTION
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {dailyLog?.review?.status === 'completed'
                  ? `Day Review Completed! Execution Score: ${dailyLog.review.dailyScore}%`
                  : 'Complete Your Daily Execution Review'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Reflect on what went well, log what to improve tomorrow, and calculate your daily score.
              </p>
            </div>

            <button
              onClick={() => navigate('/daily-review')}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold font-mono tracking-wider transition flex items-center justify-center gap-2 shrink-0 shadow-glow-orange"
            >
              <span>{dailyLog?.review?.status === 'completed' ? 'VIEW REVIEW' : 'COMPLETE DAY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
