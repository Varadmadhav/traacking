import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  BookOpen,
  Flame,
  Moon,
  Footprints,
  FileCheck2,
  Dumbbell,
  Briefcase,
  StickyNote,
  Trophy,
} from 'lucide-react';
import { api } from '../../services/api';
import { useArcDate } from '../../context/DateContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { selectedDate } = useArcDate();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  // Study
  const [studySubject, setStudySubject] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [studyMinutes, setStudyMinutes] = useState('60');
  const [studyType, setStudyType] = useState('concept');

  // Protein
  const [proteinGrams, setProteinGrams] = useState('30');
  const [mealLabel, setMealLabel] = useState('Snack / Shake');

  // Steps
  const [stepsCount, setStepsCount] = useState('10000');

  // PYQ
  const [pyqSubject, setPyqSubject] = useState('');
  const [pyqTopic, setPyqTopic] = useState('');
  const [pyqYear, setPyqYear] = useState('2024');
  const [pyqResult, setPyqResult] = useState<'correct' | 'incorrect'>('correct');
  const [pyqMistakeType, setPyqMistakeType] = useState('none');
  const [pyqWhyWrong, setPyqWhyWrong] = useState('');

  // Workout
  const [workoutType, setWorkoutType] = useState('Chest');
  const [workoutMins, setWorkoutMins] = useState('60');

  // Extra task
  const [extraTitle, setExtraTitle] = useState('');
  const [extraCategory, setExtraCategory] = useState('Personal');
  const [extraMins, setExtraMins] = useState('30');

  // Note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  if (!isOpen) return null;

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/study-sessions/manual', {
        date: selectedDate,
        subject: studySubject || 'GATE Study',
        topic: studyTopic,
        durationMinutes: parseInt(studyMinutes, 10) || 60,
        studyType,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging study session');
    }
    setLoading(false);
  };

  const handleProteinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/daily-log/${selectedDate}`);
      const currentLog = res.data.log;
      const existingEntries = currentLog?.protein?.entries || [];
      const newEntry = {
        id: `m-${Date.now()}`,
        grams: parseInt(proteinGrams, 10) || 0,
        label: mealLabel || `Meal ${existingEntries.length + 1}`,
      };
      await api.put(`/daily-log/${selectedDate}/protein`, {
        entries: [...existingEntries, newEntry],
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Error updating protein');
    }
    setLoading(false);
  };

  const handleStepsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/daily-log/${selectedDate}/steps`, {
        count: parseInt(stepsCount, 10) || 0,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error updating steps');
    }
    setLoading(false);
  };

  const handlePyqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/pyqs/attempts', {
        date: selectedDate,
        subject: pyqSubject || 'General',
        topic: pyqTopic,
        year: parseInt(pyqYear, 10) || 2024,
        result: pyqResult,
        mistakeType: pyqResult === 'incorrect' ? pyqMistakeType : 'none',
        whyWrong: pyqWhyWrong,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging PYQ');
    }
    setLoading(false);
  };

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/daily-log/${selectedDate}/workout`, {
        completed: true,
        workoutType,
        durationMinutes: parseInt(workoutMins, 10) || 60,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error logging workout');
    }
    setLoading(false);
  };

  const handleExtraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/extra-tasks', {
        date: selectedDate,
        title: extraTitle,
        category: extraCategory,
        estimatedMinutes: parseInt(extraMins, 10) || 30,
        status: 'not_started',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating extra task');
    }
    setLoading(false);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notes', {
        date: selectedDate,
        title: noteTitle,
        content: noteContent,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating note');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-lg bg-dark-900 border border-dark-750 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Plus className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">QUICK LOG ACTION</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Picker Grid */}
        {!activeTab ? (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-2">
            {[
              { id: 'study', label: 'Study Block', icon: BookOpen, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
              { id: 'protein', label: 'Protein', icon: Flame, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
              { id: 'steps', label: 'Steps', icon: Footprints, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { id: 'pyq', label: 'PYQ Solve', icon: FileCheck2, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
              { id: 'workout', label: 'Gym / Workout', icon: Dumbbell, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
              { id: 'extra', label: 'Extra Task', icon: Briefcase, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
              { id: 'note', label: 'Quick Note', icon: StickyNote, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => setActiveTab(act.id)}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-dark-600 transition"
                >
                  <div className={`p-2.5 rounded-xl border mb-2 ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{act.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {/* Back to actions */}
            <button
              onClick={() => setActiveTab(null)}
              className="text-xs text-orange-400 hover:text-orange-300 mb-3 flex items-center gap-1"
            >
              ← Back to all actions
            </button>

            {/* Study Form */}
            {activeTab === 'study' && (
              <form onSubmit={handleStudySubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Log Study Session</h4>
                <input
                  type="text"
                  required
                  placeholder="Subject (e.g. C Programming)"
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Topic / Target (e.g. Pointers and Arrays)"
                  value={studyTopic}
                  onChange={(e) => setStudyTopic(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={studyMinutes}
                      onChange={(e) => setStudyMinutes(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Study Type</label>
                    <select
                      value={studyType}
                      onChange={(e) => setStudyType(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="concept">Concept</option>
                      <option value="practice">Practice</option>
                      <option value="pyq">PYQ</option>
                      <option value="revision">Revision</option>
                      <option value="mock">Mock</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition mt-2"
                >
                  {loading ? 'Saving...' : 'LOG STUDY BLOCK'}
                </button>
              </form>
            )}

            {/* Protein Form */}
            {activeTab === 'protein' && (
              <form onSubmit={handleProteinSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Add Protein Grams</h4>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Protein Amount (grams)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="200"
                    value={proteinGrams}
                    onChange={(e) => setProteinGrams(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xl font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Label (optional: Meal 3, Whey, Eggs)"
                  value={mealLabel}
                  onChange={(e) => setMealLabel(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-950 font-bold text-sm transition mt-2"
                >
                  {loading ? 'Adding...' : 'ADD PROTEIN'}
                </button>
              </form>
            )}

            {/* Steps Form */}
            {activeTab === 'steps' && (
              <form onSubmit={handleStepsSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Log Daily Steps</h4>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Step Count</label>
                  <input
                    type="number"
                    required
                    value={stepsCount}
                    onChange={(e) => setStepsCount(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-dark-950 font-bold text-sm transition mt-2"
                >
                  {loading ? 'Saving...' : 'UPDATE STEPS'}
                </button>
              </form>
            )}

            {/* PYQ Form */}
            {activeTab === 'pyq' && (
              <form onSubmit={handlePyqSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Log PYQ Solve</h4>
                <input
                  type="text"
                  required
                  placeholder="Subject (e.g. Data Structures)"
                  value={pyqSubject}
                  onChange={(e) => setPyqSubject(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Topic (e.g. Binary Trees)"
                  value={pyqTopic}
                  onChange={(e) => setPyqTopic(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPyqResult('correct')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      pyqResult === 'correct'
                        ? 'bg-emerald-500 text-dark-950 border-emerald-400'
                        : 'bg-dark-850 text-slate-400 border-dark-700'
                    }`}
                  >
                    ✓ CORRECT
                  </button>
                  <button
                    type="button"
                    onClick={() => setPyqResult('incorrect')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      pyqResult === 'incorrect'
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-dark-850 text-slate-400 border-dark-700'
                    }`}
                  >
                    ✕ WRONG (ADD TO ERROR BOOK)
                  </button>
                </div>

                {pyqResult === 'incorrect' && (
                  <div className="space-y-2 pt-2 border-t border-dark-800">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Mistake Type</label>
                      <select
                        value={pyqMistakeType}
                        onChange={(e) => setPyqMistakeType(e.target.value)}
                        className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                      >
                        <option value="concept">Concept Gap</option>
                        <option value="calculation">Calculation Error</option>
                        <option value="misread">Misread Question</option>
                        <option value="time">Time Pressure</option>
                        <option value="guess">Wrong Guess</option>
                        <option value="silly_mistake">Silly Mistake</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Why did you get it wrong?"
                      value={pyqWhyWrong}
                      onChange={(e) => setPyqWhyWrong(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-dark-950 font-bold text-sm transition mt-2"
                >
                  {loading ? 'Logging...' : 'LOG PYQ ATTEMPT'}
                </button>
              </form>
            )}

            {/* Workout Form */}
            {activeTab === 'workout' && (
              <form onSubmit={handleWorkoutSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Log Workout</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Rest'].map((wt) => (
                    <button
                      key={wt}
                      type="button"
                      onClick={() => setWorkoutType(wt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        workoutType === wt
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-dark-850 text-slate-400 border-dark-700'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={workoutMins}
                    onChange={(e) => setWorkoutMins(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition mt-2"
                >
                  {loading ? 'Saving...' : 'MARK WORKOUT COMPLETED'}
                </button>
              </form>
            )}

            {/* Extra Task Form */}
            {activeTab === 'extra' && (
              <form onSubmit={handleExtraSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Add Non-GATE Task</h4>
                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. College Assignment / NexGo)"
                  value={extraTitle}
                  onChange={(e) => setExtraTitle(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={extraCategory}
                      onChange={(e) => setExtraCategory(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                    >
                      <option value="College">College</option>
                      <option value="Career">Career</option>
                      <option value="Coding">Coding</option>
                      <option value="Personal">Personal</option>
                      <option value="Family">Family</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Est. Minutes</label>
                    <input
                      type="number"
                      value={extraMins}
                      onChange={(e) => setExtraMins(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition mt-2"
                >
                  {loading ? 'Adding...' : 'ADD EXTRA TASK'}
                </button>
              </form>
            )}

            {/* Note Form */}
            {activeTab === 'note' && (
              <form onSubmit={handleNoteSubmit} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Quick Note</h4>
                <input
                  type="text"
                  required
                  placeholder="Note Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
                />
                <textarea
                  rows={3}
                  placeholder="Formulas, key thoughts, quick notes..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition mt-2"
                >
                  {loading ? 'Saving...' : 'SAVE NOTE'}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
