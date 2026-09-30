import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Pin, Trash2, Search, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { useArcDate } from '../context/DateContext';
import { Note } from '../types';

export const NotesPage: React.FC = () => {
  const { selectedDate } = useArcDate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('C Programming');
  const [topic, setTopic] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const res = await api.get(`/notes?${params.toString()}`);
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notes', {
        title,
        content,
        subject,
        topic,
        date: selectedDate,
        isPinned,
      });
      setTitle('');
      setContent('');
      setShowModal(false);
      fetchNotes();
    } catch (err) {
      alert('Error saving note');
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await api.put(`/notes/${note._id}`, { isPinned: !note.isPinned });
      fetchNotes();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-dark-900/90 border border-dark-750 p-5 sm:p-6 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <StickyNote className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              QUICK KNOWLEDGE CAPTURE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            STUDY NOTES & FORMULAS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fast notes linked to GATE subjects and topics without unnecessary tool complexity.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs tracking-wider transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEW NOTE</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search formulas, concepts, or subject notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl bg-dark-900 border border-dark-750">
          No notes saved yet. Capture formulas, algorithms, or proof sketches with &quot;+ NEW NOTE&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition ${
                note.isPinned
                  ? 'bg-gradient-to-br from-dark-900 to-indigo-950/30 border-indigo-500/40 shadow-card-dark'
                  : 'bg-dark-900/90 border-dark-750'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {note.subject && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-dark-950 border border-dark-800 text-indigo-400">
                        {note.subject}
                      </span>
                    )}
                    {note.topic && (
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                        {note.topic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-1 rounded transition ${
                        note.isPinned ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{note.title}</h3>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              {note.date && (
                <div className="mt-4 pt-2 border-t border-dark-800 text-[10px] font-mono text-slate-500">
                  Logged: {note.date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Note Title / Formula"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <textarea
                rows={5}
                required
                placeholder="Write formula, intuition, code snippet, edge cases..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white font-mono"
              />

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-dark-950 border-dark-700 text-indigo-500"
                />
                <span>Pin this note to top</span>
              </label>

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
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
