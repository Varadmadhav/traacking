import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { GatePlanDay } from '../types';

export const GatePlanPage: React.FC = () => {
  const { setSelectedDate } = useArcDate();
  const navigate = useNavigate();

  const [days, setDays] = useState<GatePlanDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDays = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (subjectFilter !== 'all') params.append('subject', subjectFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (monthFilter !== 'all') params.append('month', monthFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/gate-plan/days?${params.toString()}`);
      if (res.data.success) {
        setDays(res.data.days);
      }
    } catch (err) {
      console.error('Error fetching GATE plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, [subjectFilter, statusFilter, monthFilter, searchQuery]);

  const uniqueSubjects = [
    'all',
    'C Programming',
    'Programming/Data Structures',
    'Data Structures',
    'DSA Revision',
    'Algorithms',
    'DSA + Algorithms',
    'Discrete Mathematics',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'Engineering Mathematics',
    'Digital Logic',
    'COA',
    'TOC',
    'Compiler Design',
  ];

  const totalDays = days.length;
  const completedDays = days.filter((d) => d.status === 'completed').length;
  const inProgressDays = days.filter((d) => d.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
                MASTER SYLLABUS CAMPAIGN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              GATE 2027 DAY-BY-DAY PLAN
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              01 October 2026 → 07 January 2027 • 99 Days Master Execution Schedule
            </p>
          </div>

          <div className="flex items-center gap-4 bg-dark-950/80 rounded-xl p-3 border border-dark-800 shrink-0">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">CAMPAIGN PROGRESS</span>
              <span className="text-lg font-bold font-mono text-white">
                {completedDays} / 99 <span className="text-xs text-orange-400">({Math.round((completedDays / 99) * 100)}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-4 border-t border-dark-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search topics / subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Months</option>
            <option value="10">October 2026 (Days 1-31)</option>
            <option value="11">November 2026 (Days 32-61)</option>
            <option value="12">December 2026 (Days 62-92)</option>
            <option value="01">January 2027 (Days 93-99)</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            {uniqueSubjects.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Subjects' : s}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Only</option>
            <option value="in_progress">In Progress Only</option>
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Days List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">
          Loading 99-day master syllabus plan...
        </div>
      ) : days.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-dark-900 border border-dark-750 text-slate-400">
          No matching days found for the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day) => {
            const completedCount = day.topics.filter((t) => t.status === 'completed').length;
            const totalCount = day.topics.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={day.date}
                className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                  day.status === 'completed'
                    ? 'bg-emerald-950/10 border-emerald-500/30'
                    : day.status === 'in_progress'
                    ? 'bg-amber-950/10 border-amber-500/30'
                    : 'bg-dark-900/90 border-dark-750 hover:border-dark-600'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Day info & Subject */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-dark-950 border border-dark-700 text-orange-400">
                        DAY {day.dayNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{day.date} ({day.dayName})</span>
                      </span>

                      {/* Status badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          day.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : day.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-dark-800 text-slate-500 border-dark-700'
                        }`}
                      >
                        {day.status === 'completed'
                          ? 'COMPLETED ✓'
                          : day.status === 'in_progress'
                          ? 'IN PROGRESS'
                          : 'NOT STARTED'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {day.primarySubject}
                    </h3>

                    {/* Topic Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {day.topics.map((t) => (
                        <span
                          key={t.id}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                            t.status === 'completed'
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                              : t.status === 'in_progress'
                              ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                              : 'bg-dark-950 border-dark-800 text-slate-300'
                          }`}
                        >
                          {t.status === 'completed' ? '✓ ' : ''}{t.name}
                        </span>
                      ))}
                    </div>

                    {/* Output & PYQ info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-400 font-mono">
                      <span>🎯 Output: <strong className="text-slate-200">{day.dailyOutput}</strong></span>
                      <span>📝 Target: <strong className="text-slate-200">{day.pyqTarget}</strong></span>
                      <span>⏱️ Est: <strong className="text-slate-200">{day.estimatedHours}h</strong></span>
                    </div>
                  </div>

                  {/* Right: Progress & Open Day button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-dark-800">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {completedCount} / {totalCount} topics ({pct}%)
                      </span>
                      <div className="w-28 bg-dark-950 rounded-full h-1.5 mt-1 overflow-hidden border border-dark-800">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDate(day.date);
                        navigate('/dashboard');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-orange-500 hover:text-dark-950 text-slate-200 text-xs font-bold font-mono transition flex items-center gap-1.5 border border-dark-700"
                    >
                      <span>EXECUTE DAY</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
