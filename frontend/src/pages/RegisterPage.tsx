import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, User, Mail, Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [examDate, setExamDate] = useState('2027-02-06');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(name, email, password, startDate, examDate);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-dark-900/90 border border-dark-750 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-dark-950 mx-auto mb-3 shadow-glow-orange">
            <Flame className="w-7 h-7 fill-dark-950" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            INITIALIZE WINTER ARC
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            JOIN THE 4-MONTH ARC
          </h1>
          <p className="text-xs text-slate-400 italic mt-1">
            &ldquo;Execute every day. Become undeniable.&rdquo;
          </p>
        </div>

        {/* Initial Benchmarks Overview */}
        <div className="bg-dark-950/80 rounded-2xl p-4 border border-dark-800 mb-6 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 block">
            PRE-CONFIGURED BENCHMARKS (EDITABLE LATER)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
            <div>🚀 Start: <strong>01 Oct 2026</strong></div>
            <div>🎯 Target: <strong>GATE 2027</strong></div>
            <div>⏱️ Study: <strong>7h / day</strong></div>
            <div>🥩 Protein: <strong>120g / day</strong></div>
            <div>🌙 Sleep: <strong>7.5h / night</strong></div>
            <div>👟 Steps: <strong>10,000 / day</strong></div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-dark-850 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Auto-imports full 99-day GATE preparation schedule on setup!</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Varad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="varad@winterarc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Arc Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">GATE Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-dark-950 font-black font-mono text-sm tracking-wider transition shadow-glow-orange flex items-center justify-center gap-2 mt-3"
          >
            <span>{loading ? 'INITIALIZING PLAN & DATABASE...' : 'START WINTER ARC'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-dark-800">
          <span className="text-xs text-slate-400">Already initialized? </span>
          <Link to="/login" className="text-xs font-bold text-orange-400 hover:text-orange-300 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
