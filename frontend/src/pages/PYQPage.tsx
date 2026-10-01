import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { PYQAttempt, ErrorBookItem } from '../types';

export const PYQPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const [activeTab, setActiveTab] = useState<'attempts' | 'errorBook'>('attempts');

  // Attempts state
  const [attempts, setAttempts] = useState<PYQAttempt[]>([]);
  const [attemptStats, setAttemptStats] = useState({ total: 0, correct: 0, incorrect: 0, accuracy: 0 });

  // Error book state
  const [errorItems, setErrorItems] = useState<ErrorBookItem[]>([]);
  const [mistakeCounts, setMistakeCounts] = useState<Record<string, number>>({});
  const [errorSearch, setErrorSearch] = useState('');
  const [errorStatusFilter, setErrorStatusFilter] = useState('all');

  // New PYQ Modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [pyqSubject, setPyqSubject] = useState('C Programming');
  const [pyqTopic, setPyqTopic] = useState('');
  const [pyqYear, setPyqYear] = useState('2024');
  const [pyqType, setPyqType] = useState<'MCQ' | 'MSQ' | 'NAT'>('MCQ');
  const [pyqMarks, setPyqMarks] = useState('1');
  const [pyqResult, setPyqResult] = useState<'correct' | 'incorrect' | 'skipped'>('correct');
  const [pyqMistake, setPyqMistake] = useState('concept');
  const [pyqWhyWrong, setPyqWhyWrong] = useState('');
  const [pyqConcept, setPyqConcept] = useState('');
  const [pyqRemember, setPyqRemember] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAttempts = async () => {
    try {
      const res = await api.get('/pyqs/attempts');
      if (res.data.success) {
        setAttempts(res.data.attempts);
        setAttemptStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching PYQ attempts:', err);
    }
  };

  const fetchErrorBook = async () => {
    try {
      const params = new URLSearchParams();
      if (errorStatusFilter !== 'all') params.append('status', errorStatusFilter);
      if (errorSearch) params.append('search', errorSearch);

      const res = await api.get(`/pyqs/error-book?${params.toString()}`);
      if (res.data.success) {
        setErrorItems(res.data.items);
        setMistakeCounts(res.data.mistakeCounts || {});
      }
    } catch (err) {
      console.error('Error fetching Error Book:', err);
    }
  };

  useEffect(() => {
    fetchAttempts();
    fetchErrorBook();

    const handleRefresh = () => {
      fetchAttempts();
      fetchErrorBook();
    };
    window.addEventListener('winter_arc_updated', handleRefresh);
    return () => window.removeEventListener('winter_arc_updated', handleRefresh);
  }, [errorStatusFilter, errorSearch, selectedDate]);

  const handleCreateAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/pyqs/attempts', {
        date: selectedDate,
        subject: pyqSubject,
        topic: pyqTopic,
        year: parseInt(pyqYear, 10) || 2024,
        questionType: pyqType,
        marks: parseInt(pyqMarks, 10) || 1,
        result: pyqResult,
        mistakeType: pyqResult === 'incorrect' ? pyqMistake : 'none',
        whyWrong: pyqWhyWrong,
        correctConcept: pyqConcept,
        whatToRemember: pyqRemember,
      });
      setShowLogModal(false);
      fetchAttempts();
      fetchErrorBook();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging PYQ');
    }
    setSaving(false);
  };

  const handleUpdateErrorStatus = async (id: string, status: 'pending' | 'reviewing' | 'mastered') => {
    try {
      await api.put(`/pyqs/error-book/${id}`, { status });
      fetchErrorBook();
    } catch (err) {
      console.error('Error updating error book item:', err);
    }
  };

  const handleDeleteError = async (id: string) => {
    if (!window.confirm('Delete this error entry?')) return;
    try {
      await api.delete(`/pyqs/error-book/${id}`);
      fetchErrorBook();
    } catch (err) {
      console.error('Error deleting error book item:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              PREVIOUS YEAR QUESTIONS & ERROR BOOK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PYQ TRACKER & ERROR VAULT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overall Solved: {attemptStats.total} • Accuracy: {attemptStats.accuracy}% • Errors to Master: {errorItems.length}
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-dark-950 font-bold font-mono text-xs tracking-wider transition flex items-center gap-2 shrink-0 shadow-glow-ice"
        >
          <Plus className="w-4 h-4" />
          <span>+ LOG PYQ SOLVE</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setActiveTab('attempts')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
            activeTab === 'attempts'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ALL SOLVED PYQS ({attempts.length})
        </button>
        <button
          onClick={() => setActiveTab('errorBook')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
            activeTab === 'errorBook'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ERROR BOOK ({errorItems.length})</span>
        </button>
      </div>

      {/* Content: Attempts View */}
      {activeTab === 'attempts' && (
        <div className="space-y-4">
          {/* Quick Accuracy Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-dark-900 border border-dark-750 rounded-xl p-3.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ATTEMPTED</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">{attemptStats.total}</span>
            </div>
            <div className="bg-dark-900 border border-emerald-500/30 rounded-xl p-3.5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">CORRECT</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block mt-0.5">{attemptStats.correct}</span>
            </div>
            <div className="bg-dark-900 border border-rose-500/30 rounded-xl p-3.5">
              <span className="text-[10px] font-mono text-rose-400 uppercase">INCORRECT</span>
              <span className="text-xl font-bold font-mono text-rose-400 block mt-0.5">{attemptStats.incorrect}</span>
            </div>
            <div className="bg-dark-900 border border-sky-500/30 rounded-xl p-3.5">
              <span className="text-[10px] font-mono text-sky-400 uppercase">ACCURACY</span>
              <span className="text-xl font-bold font-mono text-sky-400 block mt-0.5">{attemptStats.accuracy}%</span>
            </div>
          </div>

          {/* List of Attempts */}
          {attempts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
              No PYQ attempts logged yet. Click &quot;+ LOG PYQ SOLVE&quot; to begin building your question bank.
            </div>
          ) : (
            <div className="space-y-2.5">
              {attempts.map((att) => (
                <div
                  key={att._id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                    att.result === 'correct'
                      ? 'bg-dark-900/90 border-emerald-500/20'
                      : 'bg-dark-900/90 border-rose-500/20'
                  }`}
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono font-bold text-white">{att.subject}</span>
                      {att.year && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300">
                          GATE {att.year}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400">
                        {att.questionType} • {att.marks} Mark
                      </span>
                      {att.result === 'incorrect' && att.mistakeType && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          {att.mistakeType.toUpperCase()} MISTAKE
                        </span>
                      )}
                    </div>
                    {att.topic && <p className="text-xs text-slate-300 truncate">{att.topic}</p>}
                    <span className="text-[10px] font-mono text-slate-500">{att.date}</span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      att.result === 'correct'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {att.result.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content: Error Book View */}
      {activeTab === 'errorBook' && (
        <div className="space-y-4">
          {/* Mistake Category breakdown summary */}
          <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 shadow-card-dark">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">
              MISTAKE ROOT-CAUSE ANALYSIS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {['concept', 'calculation', 'misread', 'time', 'guess', 'silly_mistake'].map((m) => (
                <div key={m} className="bg-dark-950 p-2.5 rounded-xl border border-dark-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block truncate">
                    {m.replace('_', ' ')}
                  </span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    {mistakeCounts[m] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search wrong concepts / questions..."
                value={errorSearch}
                onChange={(e) => setErrorSearch(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
            </div>
            <select
              value={errorStatusFilter}
              onChange={(e) => setErrorStatusFilter(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Revision</option>
              <option value="reviewing">Under Review</option>
              <option value="mastered">Mastered ✓</option>
            </select>
          </div>

          {/* Error Book Cards */}
          {errorItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
              No errors in vault matching criteria. Keep practicing and converting every mistake into permanent wisdom!
            </div>
          ) : (
            <div className="space-y-3">
              {errorItems.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-2xl border p-4 sm:p-5 transition ${
                    item.status === 'mastered'
                      ? 'bg-emerald-950/10 border-emerald-500/30 opacity-80'
                      : 'bg-dark-900/90 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-orange-400">{item.subject}</span>
                        {item.topic && <span className="text-xs text-slate-300">({item.topic})</span>}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          {item.mistakeType.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">{item.question}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.status !== 'mastered' ? (
                        <button
                          onClick={() => handleUpdateErrorStatus(item._id, 'mastered')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-dark-950 text-xs font-bold font-mono transition"
                        >
                          MARK MASTERED ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateErrorStatus(item._id, 'pending')}
                          className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-300 text-xs font-mono"
                        >
                          REOPEN
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteError(item._id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Error Breakdown Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-dark-800 text-xs">
                    <div className="bg-dark-950 p-2.5 rounded-xl border border-dark-800">
                      <span className="text-[10px] font-mono font-bold text-rose-400 block mb-0.5">
                        WHY I GOT IT WRONG
                      </span>
                      <p className="text-slate-300">{item.whyWrong}</p>
                    </div>

                    <div className="bg-dark-950 p-2.5 rounded-xl border border-dark-800">
                      <span className="text-[10px] font-mono font-bold text-sky-400 block mb-0.5">
                        CORRECT THEORY / CONCEPT
                      </span>
                      <p className="text-slate-300">{item.correctConcept}</p>
                    </div>

                    <div className="bg-dark-950 p-2.5 rounded-xl border border-dark-800">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">
                        WHAT TO REMEMBER (EXAM TIP)
                      </span>
                      <p className="text-slate-300">{item.whatToRemember}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Log PYQ Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-3">Log PYQ Solve Attempt</h3>
            <form onSubmit={handleCreateAttempt} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Subject (e.g. Operating Systems)"
                value={pyqSubject}
                onChange={(e) => setPyqSubject(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
              />

              <input
                type="text"
                placeholder="Topic (e.g. CPU Scheduling Numericals)"
                value={pyqTopic}
                onChange={(e) => setPyqTopic(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Year</label>
                  <input
                    type="number"
                    value={pyqYear}
                    onChange={(e) => setPyqYear(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-sm font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Type</label>
                  <select
                    value={pyqType}
                    onChange={(e) => setPyqType(e.target.value as any)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-sm text-white"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="MSQ">MSQ</option>
                    <option value="NAT">NAT</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Marks</label>
                  <select
                    value={pyqMarks}
                    onChange={(e) => setPyqMarks(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-sm text-white"
                  >
                    <option value="1">1 Mark</option>
                    <option value="2">2 Marks</option>
                  </select>
                </div>
              </div>

              {/* Result Select */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['correct', 'incorrect', 'skipped'].map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setPyqResult(res as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      pyqResult === res
                        ? res === 'correct'
                          ? 'bg-emerald-500 text-dark-950 border-emerald-400'
                          : res === 'incorrect'
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-amber-500 text-dark-950 border-amber-400'
                        : 'bg-dark-850 text-slate-400 border-dark-750'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Error Book fields if incorrect */}
              {pyqResult === 'incorrect' && (
                <div className="space-y-2 pt-3 border-t border-dark-800 bg-rose-950/10 p-3 rounded-xl border border-rose-500/20">
                  <span className="text-xs font-mono font-bold text-rose-400 block">
                    ERROR BOOK AUTO-CREATION
                  </span>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Mistake Category</label>
                    <select
                      value={pyqMistake}
                      onChange={(e) => setPyqMistake(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="concept">Concept Gap / Unclear Theory</option>
                      <option value="calculation">Calculation / Arithmetic Error</option>
                      <option value="misread">Misread Question / Missed &quot;NOT&quot; condition</option>
                      <option value="time">Time Pressure Rush</option>
                      <option value="guess">Blind Guess</option>
                      <option value="silly_mistake">Silly Mistake / Notation confusion</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Why did you get it wrong?"
                    value={pyqWhyWrong}
                    onChange={(e) => setPyqWhyWrong(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Correct concept explanation"
                    value={pyqConcept}
                    onChange={(e) => setPyqConcept(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Key thing to remember to prevent repeat mistake"
                    value={pyqRemember}
                    onChange={(e) => setPyqRemember(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-dark-950 font-bold text-xs"
                >
                  {saving ? 'Logging...' : 'SAVE ATTEMPT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
