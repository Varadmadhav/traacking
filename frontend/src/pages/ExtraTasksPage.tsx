import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Check, Clock, Circle, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { ExtraTask } from '../types';

export const ExtraTasksPage: React.FC = () => {
  const { selectedDate, formattedDisplayDate } = useArcDate();
  const [tasks, setTasks] = useState<ExtraTask[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'College' | 'Career' | 'Coding' | 'Personal' | 'Family' | 'Other'>('Coding');
  const [estMins, setEstMins] = useState('30');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/extra-tasks?date=${selectedDate}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching extra tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/extra-tasks', {
        date: selectedDate,
        title,
        category,
        estimatedMinutes: parseInt(estMins, 10) || 30,
        notes,
      });
      setTitle('');
      setNotes('');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert('Error creating extra task');
    }
  };

  const handleToggleStatus = async (task: ExtraTask) => {
    let nextStatus: 'not_started' | 'in_progress' | 'completed';
    if (task.status === 'not_started') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else nextStatus = 'not_started';

    try {
      await api.put(`/extra-tasks/${task._id}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling extra task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/extra-tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting extra task:', err);
    }
  };

  const categories = ['College', 'Career', 'Coding', 'Personal', 'Family', 'Other'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
              NON-GATE LIFE & SIDE WORK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            EXTRA TASKS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {formattedDisplayDate} • Manage college assignments, NexGo, coding projects, and personal work without cluttering your core GATE timetable.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs tracking-wider transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ ADD TASK</span>
        </button>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="rounded-2xl bg-dark-900 border border-purple-500/30 p-5 space-y-3 shadow-card-dark"
        >
          <h3 className="text-sm font-bold text-white uppercase font-mono">Add Non-GATE Task</h3>

          <input
            type="text"
            required
            placeholder="Task title (e.g. NexGo Frontend build, College Project review, Resume polish)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Estimated Minutes</label>
              <input
                type="number"
                value={estMins}
                onChange={(e) => setEstMins(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Optional context / notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-xl bg-dark-800 text-slate-400 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono"
            >
              Save Extra Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading extra tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
          No extra tasks scheduled for {formattedDisplayDate}. Keep the main focus on GATE execution!
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((t) => (
            <div
              key={t._id}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition ${
                t.status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : t.status === 'in_progress'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-dark-900/90 border-dark-750 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleStatus(t)}
                className="flex items-center gap-3 text-left min-w-0 flex-1"
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    t.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-400 text-dark-950'
                      : t.status === 'in_progress'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                      : 'bg-dark-950 border-dark-700 text-slate-600'
                  }`}
                >
                  {t.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {t.status === 'in_progress' && <Clock className="w-3 h-3 stroke-[2.5]" />}
                  {t.status === 'not_started' && <Circle className="w-2.5 h-2.5 opacity-40" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-dark-950 border border-dark-750 text-purple-400">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ~{t.estimatedMinutes} mins
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold truncate ${t.status === 'completed' ? 'line-through opacity-75' : ''}`}>
                    {t.title}
                  </h4>
                  {t.notes && <p className="text-[11px] text-slate-400 mt-0.5 italic">&ldquo;{t.notes}&rdquo;</p>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteTask(t._id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition shrink-0 ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
