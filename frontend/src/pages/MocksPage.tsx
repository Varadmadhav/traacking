import React, { useState, useEffect } from 'react';
import { Trophy, Plus, TrendingUp, AlertTriangle, Trash2, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { MockTest } from '../types';

export const MocksPage: React.FC = () => {
  const [mocks, setMocks] = useState<MockTest[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, avgAccuracy: 0 });
  const [loading, setLoading] = useState(true);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [testType, setTestType] = useState<'Subject' | 'Multi-Subject' | 'Full-Length'>('Subject');
  const [subject, setSubject] = useState('C Programming');
  const [totalMarks, setTotalMarks] = useState('100');
  const [score, setScore] = useState('65');
  const [attempted, setAttempted] = useState('50');
  const [correct, setCorrect] = useState('40');
  const [incorrect, setIncorrect] = useState('10');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMocks = async () => {
    try {
      const res = await api.get('/mock-tests');
      if (res.data.success) {
        setMocks(res.data.mocks);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching mocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  const handleCreateMock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/mock-tests', {
        title,
        date,
        testType,
        subject,
        totalMarks: parseFloat(totalMarks) || 100,
        score: parseFloat(score) || 0,
        attempted: parseInt(attempted, 10) || 0,
        correct: parseInt(correct, 10) || 0,
        incorrect: parseInt(incorrect, 10) || 0,
        notes,
      });
      setShowModal(false);
      fetchMocks();
    } catch (err) {
      alert('Error saving mock test');
    }
    setSaving(false);
  };

  const handleDeleteMock = async (id: string) => {
    if (!window.confirm('Delete this mock entry?')) return;
    try {
      await api.delete(`/mock-tests/${id}`);
      fetchMocks();
    } catch (err) {
      console.error('Error deleting mock:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              EXAM SIMULATION & TIMED TESTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MOCK TESTS TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track performance across subject tests, multi-subject tests, and full-length 3-hour mocks.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-950 font-bold font-mono text-xs tracking-wider transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ LOG MOCK TEST</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL MOCKS</span>
          <span className="text-2xl font-bold font-mono text-white block mt-0.5">{stats.total}</span>
        </div>
        <div className="bg-dark-900 border border-amber-500/30 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-amber-400 uppercase">AVG SCORE</span>
          <span className="text-2xl font-bold font-mono text-amber-400 block mt-0.5">{stats.avgScore}</span>
        </div>
        <div className="bg-dark-900 border border-emerald-500/30 rounded-2xl p-4">
          <span className="text-[10px] font-mono text-emerald-400 uppercase">AVG ACCURACY</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block mt-0.5">{stats.avgAccuracy}%</span>
        </div>
      </div>

      {/* Mock Tests List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading mock tests...</div>
      ) : mocks.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
          No mock tests logged yet. As you take subject and full-length tests according to the campaign schedule, log them here!
        </div>
      ) : (
        <div className="space-y-3">
          {mocks.map((m) => (
            <div
              key={m._id}
              className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card-dark"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-dark-950 border border-dark-700 text-amber-400">
                    {m.testType.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{m.date}</span>
                </div>
                <h3 className="text-base font-bold text-white truncate">{m.title}</h3>
                {m.subject && <span className="text-xs text-slate-400 font-mono block mt-0.5">{m.subject}</span>}
                {m.notes && <p className="text-xs text-slate-400 italic mt-1">&ldquo;{m.notes}&rdquo;</p>}
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">SCORE</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {m.score} <span className="text-xs font-normal text-slate-400">/ {m.totalMarks}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    {m.accuracy}% accuracy
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteMock(m._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Log Mock Test Result</h3>
            <form onSubmit={handleCreateMock} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Test Title (e.g. C Programming Mini-Test)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Subject">Subject Test</option>
                    <option value="Multi-Subject">Multi-Subject Test</option>
                    <option value="Full-Length">Full-Length Mock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Score</label>
                  <input
                    type="number"
                    step="0.25"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Attempted</label>
                  <input
                    type="number"
                    value={attempted}
                    onChange={(e) => setAttempted(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Correct</label>
                  <input
                    type="number"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Incorrect</label>
                  <input
                    type="number"
                    value={incorrect}
                    onChange={(e) => setIncorrect(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Notes / areas to improve"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-950 font-bold text-xs font-mono"
                >
                  {saving ? 'Saving...' : 'Save Mock Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
