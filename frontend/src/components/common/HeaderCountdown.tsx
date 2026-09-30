import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Flame, Target } from 'lucide-react';
import { useArcDate } from '../../context/DateContext';

export const HeaderCountdown: React.FC = () => {
  const {
    formattedDisplayDate,
    dayName,
    arcDayNumber,
    totalArcDays,
    daysLeftToGate,
    isToday,
    goToToday,
    goToNextDay,
    goToPrevDay,
  } = useArcDate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-dark-750 p-4 sm:p-6 shadow-card-dark">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Winter Arc Title & Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              WINTER ARC // DAY {arcDayNumber} OF {totalArcDays}
            </span>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-700 text-slate-300 hover:text-white border border-dark-600 transition"
              >
                GO TO TODAY
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            WINTER ARC <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">2026–27</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 italic mt-0.5">
            &ldquo;Execute every day. Become undeniable.&rdquo;
          </p>
        </div>

        {/* Middle: Date Switcher */}
        <div className="flex items-center justify-between sm:justify-center gap-2 bg-dark-950/80 border border-dark-700/80 rounded-xl px-3 py-2">
          <button
            onClick={goToPrevDay}
            className="p-1.5 rounded-lg hover:bg-dark-800 text-slate-400 hover:text-white transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center px-2">
            <div className="text-xs font-medium text-orange-400 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{dayName}</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-100 font-mono">
              {formattedDisplayDate}
            </div>
          </div>

          <button
            onClick={goToNextDay}
            className="p-1.5 rounded-lg hover:bg-dark-800 text-slate-400 hover:text-white transition"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: GATE 2027 Countdown Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-dark-950 to-dark-900 border border-orange-500/30 rounded-xl p-3 sm:px-4 sm:py-3 shadow-glow-orange">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-orange-400 uppercase">
              GATE 2027
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                {daysLeftToGate}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Days Left
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
