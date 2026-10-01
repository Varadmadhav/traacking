import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { RevisionItem } from '../types';

export const RevisionsPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('date', selectedDate);

      const res = await api.get(`/revisions?${params.toString()}`);
      if (res.data.success) {
        setRevisions(res.data.revisions);
      }
    } catch (err) {
      console.error('Error fetching revisions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();

    const handleRefresh = () => fetchRevisions();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [statusFilter, selectedDate]);

  const handleComplete = async (id: string) => {
    try {
      await api.put(`/revisions/${id}/complete`);
      fetchRevisions();
    } catch (err) {
      console.error('Error completing revision:', err);
    }
  };

  const handleSnooze = async (id: string) => {
    try {
      await api.put(`/revisions/${id}/snooze`, { days: 1 });
      fetchRevisions();
    } catch (err) {
      console.error('Error snoozing revision:', err);
    }
  };

  const dueTodayCount = revisions.filter(
    (r) => r.dueDate <= selectedDate && r.status === 'pending'
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <RotateCcw className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            SPACED REPETITION ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ACTIVE REVISIONS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {formattedDisplayDate} • Automatically scheduled at intervals of +1 day, +7 days, +21 days, and +45 days to lock in permanent retention.
        </p>
      </div>

      {/* Due Banner */}
      {dueTodayCount > 0 ? (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase">
                {dueTodayCount} REVISIONS DUE TODAY
              </h4>
              <p className="text-xs text-slate-300">
                Execute spaced recalls to prevent memory decay.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 flex items-center gap-3 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>All scheduled revisions are up to date for this date!</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-dark-800 pb-2">
        {['all', 'pending', 'completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
              statusFilter === st
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st === 'all' ? 'ALL MILESTONES' : st === 'pending' ? 'PENDING / DUE' : 'COMPLETED ✓'}
          </button>
        ))}
      </div>

      {/* Revisions List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading revisions...</div>
      ) : revisions.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
          No revisions scheduled yet. As you mark GATE topics &quot;COMPLETED&quot;, spaced repetition milestones are automatically scheduled!
        </div>
      ) : (
        <div className="space-y-3">
          {revisions.map((rev) => {
            const isOverdueOrDue = rev.dueDate <= selectedDate && rev.status === 'pending';
            return (
              <div
                key={rev._id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  rev.status === 'completed'
                    ? 'bg-emerald-950/10 border-emerald-500/20 opacity-80'
                    : isOverdueOrDue
                    ? 'bg-dark-900/90 border-amber-500/40 shadow-glow-orange'
                    : 'bg-dark-900/90 border-dark-750'
                }`}
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-bold text-orange-400">{rev.subject}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 border border-dark-700 text-slate-300">
                      Revision #{rev.revisionNumber} ({rev.revisionNumber === 1 ? '+1 Day' : rev.revisionNumber === 2 ? '+7 Days' : rev.revisionNumber === 3 ? '+21 Days' : '+45 Days'})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Due: {rev.dueDate}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white truncate">{rev.topicName}</h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {rev.status !== 'completed' ? (
                    <>
                      <button
                        onClick={() => handleComplete(rev._id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-dark-950 text-xs font-bold font-mono transition flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>DONE</span>
                      </button>
                      <button
                        onClick={() => handleSnooze(rev._id)}
                        className="px-2.5 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 text-xs font-mono transition border border-dark-700"
                      >
                        SNOOZE +1D
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      MASTERED ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
