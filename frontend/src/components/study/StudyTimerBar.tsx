import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, BookOpen, Star, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { StudySession } from '../../types';

interface StudyTimerBarProps {
  currentSubject?: string;
  currentTopic?: string;
  onSessionLogged?: (session: StudySession) => void;
}

export const StudyTimerBar: React.FC<StudyTimerBarProps> = ({
  currentSubject = 'C Programming',
  currentTopic = '',
  onSessionLogged,
}) => {
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState(currentSubject);
  const [topic, setTopic] = useState(currentTopic);
  const [studyType, setStudyType] = useState<'concept' | 'practice' | 'pyq' | 'revision' | 'mock'>('concept');
  const [isLoading, setIsLoading] = useState(false);

  // Stop rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);
  const [focusRating, setFocusRating] = useState(4);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [notes, setNotes] = useState('');

  // Fetch active session on mount
  useEffect(() => {
    const checkActive = async () => {
      try {
        const res = await api.get('/study-sessions/active');
        if (res.data.success && res.data.activeSession) {
          const session = res.data.activeSession;
          setActiveSession(session);
          setSubject(session.subject);
          setTopic(session.topic || '');
          setStudyType(session.studyType || 'concept');

          // Calculate elapsed seconds from startTime
          const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
          setSeconds(Math.max(0, elapsed));
        }
      } catch (err) {
        // ignore
      }
    };
    checkActive();
  }, []);

  // Update subject/topic if prop changes and not active
  useEffect(() => {
    if (!activeSession) {
      if (currentSubject) setSubject(currentSubject);
      if (currentTopic) setTopic(currentTopic);
    }
  }, [currentSubject, currentTopic, activeSession]);

  // Ticking timer
  useEffect(() => {
    let interval: any;
    if (activeSession) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleStartTimer = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/study-sessions/start', {
        subject,
        topic,
        studyType,
      });
      if (res.data.success) {
        setActiveSession(res.data.session);
        setSeconds(0);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not start study timer');
    }
    setIsLoading(false);
  };

  const handleStopTimer = async () => {
    if (!activeSession) return;
    setIsLoading(true);
    try {
      const res = await api.post(`/study-sessions/stop/${activeSession._id}`, {
        focusRating,
        difficultyRating,
        confidenceRating,
        notes,
      });
      if (res.data.success) {
        setCompletedSessionId(activeSession._id);
        setShowRatingModal(true);
        if (onSessionLogged) onSessionLogged(res.data.session);
        setActiveSession(null);
        setSeconds(0);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error stopping session');
    }
    setIsLoading(false);
  };

  const handleSaveRatings = async () => {
    if (completedSessionId) {
      try {
        await api.post(`/study-sessions/stop/${completedSessionId}`, {
          focusRating,
          difficultyRating,
          confidenceRating,
          notes,
        });
      } catch (err) {
        // ignore
      }
    }
    setShowRatingModal(false);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
          activeSession
            ? 'bg-gradient-to-r from-orange-950/40 via-dark-900 to-amber-950/40 border-orange-500/50 shadow-glow-orange'
            : 'bg-dark-900/90 border-dark-750 shadow-card-dark'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Status + Subject Selectors */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`p-3 rounded-xl border shrink-0 ${
                activeSession
                  ? 'bg-orange-500 text-dark-950 border-orange-400 animate-pulse'
                  : 'bg-dark-800 text-slate-400 border-dark-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSession ? 'bg-orange-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {activeSession ? 'STUDY SESSION IN PROGRESS' : 'FOCUS STOPWATCH'}
                </span>
              </div>

              {activeSession ? (
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white truncate">
                    {subject} <span className="text-xs font-normal text-orange-300">({studyType})</span>
                  </h4>
                  {topic && <p className="text-xs text-slate-400 truncate">{topic}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (e.g. C Programming)"
                    className="bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic / Target"
                    className="bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Middle: Live Timer Digits */}
          <div className="text-center px-4 py-2 bg-dark-950/80 rounded-xl border border-dark-800 shrink-0">
            <span className="text-xs font-mono text-slate-400 block">ELAPSED TIME</span>
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Right: Start / Stop Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {!activeSession ? (
              <button
                type="button"
                onClick={handleStartTimer}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-dark-950 font-bold font-mono text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-glow-orange"
              >
                <Play className="w-4 h-4 fill-dark-950" />
                <span>START STUDY</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopTimer}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-card-dark"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>STOP & LOG</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Post-Session Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">SESSION LOGGED!</h3>
                <p className="text-xs text-slate-400">Quick 1-tap quality rating (optional)</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4">
              {/* Focus */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Focus & Depth (1 to 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFocusRating(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                        focusRating === n
                          ? 'bg-orange-500 text-white border-orange-400'
                          : 'bg-dark-850 text-slate-400 border-dark-750'
                      }`}
                    >
                      {n}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Concept Difficulty (1 to 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDifficultyRating(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                        difficultyRating === n
                          ? 'bg-amber-500 text-white border-amber-400'
                          : 'bg-dark-850 text-slate-400 border-dark-750'
                      }`}
                    >
                      {n}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Retention / Confidence (1 to 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setConfidenceRating(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                        confidenceRating === n
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-dark-850 text-slate-400 border-dark-750'
                      }`}
                    >
                      {n}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Key Takeaway / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mastered recursion trees, solved 15 tree traversal PYQs"
                  className="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveRatings}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold tracking-wide transition"
            >
              SAVE & CONTINUE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
