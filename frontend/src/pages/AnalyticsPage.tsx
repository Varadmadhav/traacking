import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Moon,
  Smartphone,
  Footprints,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading analytics engine...</div>;
  }

  const readiness = data?.readiness;
  const syllabus = data?.gateSyllabus;
  const study = data?.study;
  const pyqs = data?.pyqs;
  const dailyTrend = data?.trends?.dailyStudyTrend || [];

  const COLORS = ['#FF5722', '#F59E0B', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <BarChart3 className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            PERFORMANCE & ADAPTATION INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ANALYTICS // &ldquo;AM I IMPROVING?&rdquo;
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Measurable execution data tracking your 4-month Winter Arc transformation for GATE 2027.
        </p>
      </div>

      {/* 1. GATE PREPARATION STATUS ENGINE */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-orange-500/30 p-5 sm:p-6 shadow-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800 mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              GATE PREPARATION STATUS
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                {readiness?.status || 'BUILDING'}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                SCORE: {readiness?.score || 0}/100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-sm">
            Calculated strictly from syllabus coverage ({readiness?.syllabusPercent}%), PYQ accuracy ({readiness?.pyqAccuracy}%), and revision mastery ({readiness?.revCompletionRate}%).
          </p>
        </div>

        {/* Readiness 4-State Stage Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className={readiness?.status === 'NOT STARTED' ? 'text-orange-400 font-bold' : ''}>NOT STARTED</span>
            <span className={readiness?.status === 'BUILDING' ? 'text-amber-400 font-bold' : ''}>BUILDING</span>
            <span className={readiness?.status === 'ON TRACK' ? 'text-sky-400 font-bold' : ''}>ON TRACK</span>
            <span className={readiness?.status === 'STRONG PREPARATION' ? 'text-emerald-400 font-bold' : ''}>STRONG PREPARATION</span>
            <span className={readiness?.status === 'EXAM READY' ? 'text-emerald-300 font-bold' : ''}>EXAM READY</span>
          </div>

          <div className="w-full bg-dark-950 rounded-full h-3 overflow-hidden border border-dark-800">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(5, readiness?.score || 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SYLLABUS COVERAGE</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">{syllabus?.percent || 0}%</span>
          <span className="text-xs text-slate-400 font-mono">{syllabus?.completedTopics || 0}/{syllabus?.totalTopics || 0} topics</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL STUDY TIME</span>
          <span className="text-2xl font-bold font-mono text-white block mt-1">{study?.totalHours || 0}h</span>
          <span className="text-xs text-slate-400 font-mono">{study?.totalSessions || 0} sessions</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">PYQ ACCURACY</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">{pyqs?.accuracy || 0}%</span>
          <span className="text-xs text-slate-400 font-mono">{pyqs?.correct || 0}/{pyqs?.total || 0} correct</span>
        </div>

        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">REVISIONS COMPLETED</span>
          <span className="text-2xl font-bold font-mono text-amber-400 block mt-1">{data?.revisions?.completed || 0}</span>
          <span className="text-xs text-slate-400 font-mono">{data?.revisions?.rate || 0}% hit rate</span>
        </div>
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Hours Trend */}
        <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">DAILY STUDY HOURS (LAST 14 DAYS)</h3>
            <span className="text-xs font-mono text-orange-400">Target: 7h/day</span>
          </div>

          <div className="h-64 w-full">
            {dailyTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Study chart will populate as daily sessions are logged.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrend}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="studyHours" name="Study Hours" fill="#FF5722" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Daily Execution Score Trend */}
        <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">DAILY EXECUTION SCORE TREND</h3>
            <span className="text-xs font-mono text-emerald-400">Target: 80%+</span>
          </div>

          <div className="h-64 w-full">
            {dailyTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Execution score curve builds from night reviews.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="dailyScore" name="Daily Score %" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
