import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { RoadmapSection } from '../types';
import { useArcDate } from '../context/DateContext';

export const RoadmapPage: React.FC = () => {
  const [sections, setSections] = useState<RoadmapSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('sec-4');
  const { setSelectedDate } = useArcDate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get('/gate-plan/roadmap');
        if (res.data.success) {
          setSections(res.data.sections);
        }
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <GraduationCap className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            FULL SYLLABUS ARCHITECTURE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          GATE 10-SECTION ROADMAP
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tracking syllabus coverage, assigned campaign dates, topic mastery, and PYQ depth across all 10 core subjects.
        </p>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">
          Loading roadmap sections...
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, idx) => {
            const isExpanded = expandedSectionId === sec.id;
            return (
              <div
                key={sec.id}
                className="rounded-2xl bg-dark-900/90 border border-dark-750 overflow-hidden shadow-card-dark transition"
              >
                {/* Section Header Accordion Button */}
                <button
                  type="button"
                  onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                  className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-dark-850 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border"
                      style={{
                        backgroundColor: `${sec.color}15`,
                        borderColor: `${sec.color}40`,
                        color: sec.color,
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">{sec.weightage}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            sec.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : sec.status === 'In Progress'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-dark-800 text-slate-500 border-dark-700'
                          }`}
                        >
                          {sec.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate mt-0.5">
                        {sec.name}
                      </h3>
                    </div>
                  </div>

                  {/* Right Metrics & Progress Bar */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        {sec.completedTopics} / {sec.totalTopics} topics ({sec.progress}%)
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>📝 {sec.pyqCount} PYQs</span>
                        <span>🔄 {sec.revisionCount} Revs</span>
                      </div>
                    </div>

                    <div className="w-20 sm:w-28 bg-dark-950 rounded-full h-2 overflow-hidden border border-dark-800 shrink-0">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sec.progress}%`, backgroundColor: sec.color }}
                      />
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-dark-950/60 border-t border-dark-800 space-y-4">
                    {/* Assigned Campaign Days in 99-Day Schedule */}
                    {sec.assignedDays && sec.assignedDays.length > 0 && (
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">
                          ASSIGNED CAMPAIGN DAYS ({sec.assignedDays.length} DAYS)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {sec.assignedDays.map((d) => (
                            <button
                              key={d.date}
                              type="button"
                              onClick={() => {
                                setSelectedDate(d.date);
                                navigate('/dashboard');
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-left transition"
                            >
                              <div>
                                <span className="text-xs font-mono font-bold text-orange-400">
                                  DAY {d.dayNumber} • {d.date}
                                </span>
                                <span className="text-xs text-slate-300 block truncate">
                                  {d.completedCount}/{d.topicsCount} topics complete
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">OPEN →</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Standard Official GATE Syllabus Topics */}
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">
                        OFFICIAL GATE CS SYLLABUS MODULES
                      </span>

                      <div className="space-y-1.5">
                        {sec.topics.map((tName, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-dark-900 border border-dark-800 text-xs text-slate-200"
                          >
                            <span
                              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: sec.color }}
                            />
                            <span>{tName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
