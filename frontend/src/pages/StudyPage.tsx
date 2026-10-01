import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  Sparkles,
  Calendar,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { StudyTimerBar } from '../components/study/StudyTimerBar';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';
import { StudySession } from '../types';

export const StudyPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  // Manual session modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [mSubject, setMSubject] = useState('C Programming');
  const [mTopic, setMTopic] = useState('');
  const [mMinutes, setMMinutes] = useState('60');
  const [mType, setMType] = useState<'concept' | 'practice' | 'pyq' | 'revision' | 'mock'>('concept');
  const [mFocus, setMFocus] = useState(4);
  const [mDiff, setMDiff] = useState(3);
  const [mConf, setMConf] = useState(4);
  const [mNotes, setMNotes] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/study-sessions?date=${selectedDate}`);
      if (res.data.success) {
        setSessions(res.data.sessions);
        setTotalHours(res.data.totalHours);
      }
    } catch (err) {
      console.error('Error fetching study sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    const handleRefresh = () => fetchSessions();
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [selectedDate]);

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Delete this study log?')) return;
    try {
      await api.delete(`/study-sessions/${id}`);
      fetchSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/study-sessions/manual', {
        date: selectedDate,
        subject: mSubject,
        topic: mTopic,
        durationMinutes: parseInt(mMinutes, 10) || 60,
        studyType: mType,
        focusRating: mFocus,
        difficultyRating: mDiff,
        confidenceRating: mConf,
        notes: mNotes,
      });
      setShowManualModal(false);
      fetchSessions();
    } catch (err) {
      alert('Error creating manual study session');
    }
  };

  const targetHours = user?.studyTargetHours || 7;
  const remainingHours = Math.max(0, targetHours - totalHours);
  const progressPercent = Math.min(100, Math.round((totalHours / targetHours) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              STUDY ENGINE & LOGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            STUDY TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {formattedDisplayDate} • Logged {totalHours}h / {targetHours}h target
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold font-mono border border-dark-700 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ MANUAL SESSION</span>
        </button>
      </div>

      {/* Live Timer Widget */}
      <StudyTimerBar
        currentSubject="C Programming"
        onSessionLogged={() => fetchSessions()}
      />

      {/* Target Progress Card */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">TODAY'S STUDY HOURS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">{totalHours}h</span>
              <span className="text-xs font-medium text-slate-400">/ {targetHours}h target</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-orange-400">
              {remainingHours > 0 ? `${remainingHours.toFixed(1)}h remaining` : 'Target Achieved! ✓'}
            </span>
            <span className="text-xs font-mono text-slate-400 block">{progressPercent}% complete</span>
          </div>
        </div>

        <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Study Session Log History */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 shadow-card-dark">
        <h3 className="text-base font-bold text-white mb-4">TODAY'S SESSIONS</h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono bg-dark-950/60 rounded-xl border border-dark-800">
            No study sessions logged for {formattedDisplayDate}. Start the timer or add a manual session.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-dark-800"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                      {s.subject}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-dark-700">
                      {s.studyType.toUpperCase()}
                    </span>
                    {s.focusRating && (
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        ★ {s.focusRating}/5 Focus
                      </span>
                    )}
                  </div>
                  {s.topic && <p className="text-xs text-slate-200 truncate">{s.topic}</p>}
                  {s.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">&ldquo;{s.notes}&rdquo;</p>}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold font-mono text-white">
                    {Math.floor(s.durationMinutes / 60)}h {s.durationMinutes % 60}m
                  </span>
                  <button
                    onClick={() => handleDeleteSession(s._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Session Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Manual Study Session</h3>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={mSubject}
                  onChange={(e) => setMSubject(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Topic</label>
                <input
                  type="text"
                  value={mTopic}
                  onChange={(e) => setMTopic(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    value={mMinutes}
                    onChange={(e) => setMMinutes(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Study Type</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value as any)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="concept">Concept</option>
                    <option value="practice">Practice</option>
                    <option value="pyq">PYQ</option>
                    <option value="revision">Revision</option>
                    <option value="mock">Mock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
