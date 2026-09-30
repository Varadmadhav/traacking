import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Circle,
  XCircle,
  BookOpen,
  Dumbbell,
  Coffee,
  Utensils,
  Moon,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TimetableBlockState, GatePlanDay } from '../../types';

interface DailyTimetableTimelineProps {
  blocks: TimetableBlockState[];
  dayPlan: GatePlanDay | null;
  onUpdateBlockStatus: (blockId: string, status: 'not_started' | 'in_progress' | 'completed' | 'skipped', notes?: string) => Promise<void>;
}

export const DailyTimetableTimeline: React.FC<DailyTimetableTimelineProps> = ({
  blocks,
  dayPlan,
  onUpdateBlockStatus,
}) => {
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Check current time and highlight block
  useEffect(() => {
    const updateActiveBlock = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMins;

      const parseTimeToMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + (m || 0);
      };

      for (const block of blocks) {
        const startMin = parseTimeToMinutes(block.startTime);
        let endMin = parseTimeToMinutes(block.endTime);
        if (endMin === 0) endMin = 1440; // midnight

        if (currentTotalMin >= startMin && currentTotalMin < endMin) {
          setCurrentBlockId(block.id);
          return;
        }
      }
      setCurrentBlockId(null);
    };

    updateActiveBlock();
    const interval = setInterval(updateActiveBlock, 60000);
    return () => clearInterval(interval);
  }, [blocks]);

  const getBlockIcon = (blockType?: string, label?: string) => {
    const l = (label || '').toLowerCase();
    if (l.includes('gate') || l.includes('math') || blockType === 'gate') return BookOpen;
    if (l.includes('gym') || blockType === 'fitness') return Dumbbell;
    if (l.includes('breakfast') || l.includes('lunch') || l.includes('dinner')) return Utensils;
    if (l.includes('break') || l.includes('rest')) return Coffee;
    if (l.includes('sleep') || l.includes('wind down')) return Moon;
    return Sparkles;
  };

  const completedCount = blocks.filter((b) => b.status === 'completed').length;
  const progressPercent = blocks.length > 0 ? Math.round((completedCount / blocks.length) * 100) : 0;

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              DAILY TIMETABLE <span className="text-xs font-mono text-slate-400 font-normal">7:30 AM – 12:00 AM</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedCount} / {blocks.length} blocks completed ({progressPercent}%)
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-white transition"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-800 rounded-full h-1.5 mb-5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timeline list */}
      {isExpanded && (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-dark-750">
          {blocks.map((block) => {
            const isCurrent = currentBlockId === block.id;
            const Icon = getBlockIcon(block.blockType, block.label);
            const isGateBlock = block.label.toLowerCase().includes('gate') || block.label.toLowerCase().includes('math');

            // Find dynamic subject/topic details for gate blocks
            let dynamicDetail = block.subLabel;
            if (!dynamicDetail && dayPlan) {
              if (block.id === 'tb-3') dynamicDetail = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block1 || dayPlan.topics.map(t=>t.name).slice(0, 2).join(', ')}`;
              if (block.id === 'tb-5') dynamicDetail = `${dayPlan.primarySubject}: ${dayPlan.blockBreakdown?.block2 || dayPlan.topics.map(t=>t.name).slice(2, 4).join(', ')}`;
              if (block.id === 'tb-8') dynamicDetail = `${dayPlan.primarySubject} Practice (${dayPlan.dailyOutput})`;
              if (block.id === 'tb-12') dynamicDetail = `${dayPlan.primarySubject} ${dayPlan.pyqTarget}`;
            }

            return (
              <div
                key={block.id}
                className={`relative group rounded-xl p-3 sm:p-4 border transition-all ${
                  isCurrent
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-glow-orange'
                    : block.status === 'completed'
                    ? 'bg-emerald-950/20 border-emerald-500/20 opacity-90'
                    : block.status === 'skipped'
                    ? 'bg-dark-950/60 border-dark-800 opacity-50'
                    : isGateBlock
                    ? 'bg-dark-850 border-dark-700/80 hover:border-orange-500/30'
                    : 'bg-dark-950/50 border-dark-800'
                }`}
              >
                {/* Timeline Dot on the connector line */}
                <div
                  className={`absolute -left-[30px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-orange-500 border-orange-300 ring-4 ring-orange-500/30'
                      : block.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-400'
                      : block.status === 'skipped'
                      ? 'bg-dark-800 border-slate-600'
                      : 'bg-dark-900 border-dark-600'
                  }`}
                >
                  {block.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-dark-950" />}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  {/* Left: Time + Title + Topics */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-slate-300 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-orange-400">
                          {block.startTime} – {block.endTime}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-orange-500 text-white font-bold animate-pulse">
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight text-white mt-0.5 ${
                          block.status === 'completed' ? 'line-through opacity-75 text-emerald-300' : ''
                        }`}
                      >
                        {block.label}
                      </h4>

                      {dynamicDetail && (
                        <p className="text-xs text-slate-300 mt-1 font-medium bg-dark-900/60 rounded-md px-2.5 py-1 border border-dark-800 inline-block">
                          {dynamicDetail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Block Status Toggles */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() =>
                        onUpdateBlockStatus(
                          block.id,
                          block.status === 'completed' ? 'not_started' : 'completed'
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition ${
                        block.status === 'completed'
                          ? 'bg-emerald-500 text-dark-950 border-emerald-400 font-bold'
                          : 'bg-dark-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border-dark-700'
                      }`}
                    >
                      {block.status === 'completed' ? 'DONE ✓' : 'COMPLETE'}
                    </button>

                    <button
                      onClick={() =>
                        onUpdateBlockStatus(
                          block.id,
                          block.status === 'in_progress' ? 'not_started' : 'in_progress'
                        )
                      }
                      className={`px-2 py-1 rounded-lg text-xs font-mono border transition ${
                        block.status === 'in_progress'
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                          : 'bg-dark-800/80 text-slate-400 hover:text-amber-300 border-dark-700'
                      }`}
                      title="Mark In Progress"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        onUpdateBlockStatus(
                          block.id,
                          block.status === 'skipped' ? 'not_started' : 'skipped'
                        )
                      }
                      className={`px-2 py-1 rounded-lg text-xs font-mono border transition ${
                        block.status === 'skipped'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-dark-800/80 text-slate-500 hover:text-rose-300 border-dark-700'
                      }`}
                      title="Mark Skipped"
                    >
                      <XCircle className="w-3.5 h-3.5" />
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
