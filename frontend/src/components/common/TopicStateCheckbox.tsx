import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Circle, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TopicSubItem } from '../../types';

interface TopicStateCheckboxProps {
  topic: TopicSubItem;
  onToggle: (topicId: string, nextStatus?: 'not_started' | 'in_progress' | 'completed', notes?: string) => Promise<void>;
  subject?: string;
}

export const TopicStateCheckbox: React.FC<TopicStateCheckboxProps> = ({ topic, onToggle, subject }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(topic.notes || '');

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);

    let nextStatus: 'not_started' | 'in_progress' | 'completed';
    if (topic.status === 'not_started') nextStatus = 'in_progress';
    else if (topic.status === 'in_progress') nextStatus = 'completed';
    else nextStatus = 'not_started';

    if (nextStatus === 'completed') {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FF5722', '#F59E0B', '#10B981', '#38BDF8'],
        });
      } catch (err) {
        // ignore confetti errors
      }
    }

    await onToggle(topic.id, nextStatus);
    setIsUpdating(false);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await onToggle(topic.id, topic.status, noteText);
    setShowNoteInput(false);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-xl border transition-all duration-200 p-3 ${
        topic.status === 'completed'
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
          : topic.status === 'in_progress'
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
          : 'bg-dark-850/60 border-dark-750 hover:border-dark-600 text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: 1-Tap Animated State Button + Topic Label */}
        <button
          onClick={handleClick}
          disabled={isUpdating}
          className="flex items-center gap-3 text-left flex-1 min-w-0"
        >
          {/* Animated 3-State Icon */}
          <motion.div
            whileTap={{ scale: 0.85 }}
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
              topic.status === 'completed'
                ? 'bg-emerald-500 border-emerald-400 text-dark-950 shadow-glow-emerald'
                : topic.status === 'in_progress'
                ? 'bg-amber-500/20 border-amber-400 text-amber-400 animate-pulse'
                : 'bg-dark-800 border-dark-600 text-slate-500 hover:border-slate-400'
            }`}
          >
            {topic.status === 'completed' && <Check className="w-4 h-4 stroke-[3]" />}
            {topic.status === 'in_progress' && <Clock className="w-3.5 h-3.5 stroke-[2.5]" />}
            {topic.status === 'not_started' && <Circle className="w-3 h-3 stroke-[2] opacity-40" />}
          </motion.div>

          <div className="min-w-0 flex-1">
            <span
              className={`text-sm sm:text-base font-medium tracking-tight block truncate ${
                topic.status === 'completed' ? 'line-through opacity-80 text-emerald-300' : ''
              }`}
            >
              {topic.name}
            </span>
          </div>
        </button>

        {/* Right: State Pill + Note trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* State pill */}
          <button
            onClick={handleClick}
            className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border transition ${
              topic.status === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : topic.status === 'in_progress'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-dark-800 border-dark-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {topic.status === 'completed'
              ? 'DONE'
              : topic.status === 'in_progress'
              ? 'IN PROGRESS'
              : 'NOT STARTED'}
          </button>

          {/* Inline Note Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNoteInput(!showNoteInput);
            }}
            className={`p-1 rounded-md transition ${
              topic.notes
                ? 'text-orange-400 bg-orange-500/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800'
            }`}
            title={topic.notes ? 'View/Edit Note' : 'Add Note'}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Existing Note preview */}
      {topic.notes && !showNoteInput && (
        <div className="mt-2 text-xs text-slate-400 bg-dark-900/60 rounded-md px-2.5 py-1.5 border border-dark-800 italic">
          &ldquo;{topic.notes}&rdquo;
        </div>
      )}

      {/* Note Edit Form */}
      <AnimatePresence>
        {showNoteInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveNote}
            className="mt-2.5 pt-2 border-t border-dark-750 flex items-center gap-2"
          >
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add key formula, doubt, or note..."
              className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowNoteInput(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
