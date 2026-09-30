import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Dumbbell,
  Moon,
  Utensils,
  Smartphone,
  CheckSquare,
  Briefcase,
  BarChart3,
  RotateCcw,
  Sparkles,
  CalendarRange,
  Settings,
  Plus,
  Menu,
  X,
  LogOut,
  StickyNote,
  GraduationCap,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QuickActionModal } from '../common/QuickActionModal';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const mainNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/today', label: 'Today', icon: CalendarCheck },
    { to: '/gate-plan', label: 'GATE Plan', icon: BookOpen },
    { to: '/roadmap', label: 'Roadmap', icon: GraduationCap },
    { to: '/study', label: 'Study Timer', icon: Sparkles },
    { to: '/fitness', label: 'Fitness & Steps', icon: Dumbbell },
    { to: '/sleep', label: 'Sleep Tracker', icon: Moon },
    { to: '/nutrition', label: 'Protein Tracker', icon: Flame },
    { to: '/phone-usage', label: 'Phone Discipline', icon: Smartphone },
    { to: '/habits', label: 'Habit Heatmap', icon: CheckSquare },
    { to: '/pyqs', label: 'PYQ & Error Book', icon: FileSpreadsheet },
    { to: '/revisions', label: 'Spaced Revisions', icon: RotateCcw },
    { to: '/extra', label: 'Extra Tasks', icon: Briefcase },
    { to: '/analytics', label: 'Analytics & Readiness', icon: BarChart3 },
    { to: '/daily-review', label: 'Daily Review', icon: Sparkles },
    { to: '/weekly-review', label: 'Weekly Review', icon: CalendarRange },
    { to: '/notes', label: 'Notes', icon: StickyNote },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleQuickSuccess = () => {
    // trigger a slight refresh or event
    window.dispatchEvent(new CustomEvent('winter_arc_updated'));
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-orange-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-dark-800 shrink-0 sticky top-0 h-screen z-30 overflow-y-auto">
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-dark-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-dark-950 font-black shadow-glow-orange">
            <Flame className="w-5 h-5 fill-dark-950" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase block leading-none">
              COMMAND CENTER
            </span>
            <span className="text-base font-extrabold tracking-tight text-white">
              WINTER ARC
            </span>
          </div>
        </div>

        {/* User quick badge */}
        <div className="px-4 py-3 bg-dark-850/60 border-b border-dark-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold font-mono">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {user?.name || 'Warrior'}
              </span>
              <span className="text-[10px] font-mono text-orange-400 block">
                GATE 2027 ASPIRANT
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-dark-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-dark-950 shadow-glow-orange">
              <Flame className="w-4 h-4 fill-dark-950" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              WINTER ARC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-orange-500 text-dark-950 text-xs font-bold flex items-center gap-1 font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>LOG</span>
            </button>
            <button
              onClick={() => setMobileMoreOpen(true)}
              className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-white border border-dark-750"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Floating Action Button (FAB) */}
        <div className="md:hidden fixed right-4 bottom-20 z-40">
          <button
            onClick={() => setQuickModalOpen(true)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-dark-950 font-black p-3.5 shadow-glow-orange flex items-center justify-center hover:scale-105 active:scale-95 transition"
            title="Quick Log"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Mobile Bottom Navigation (5 Primary Tabs: Home, Today, GATE, Fitness, More) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-md border-t border-dark-800 px-2 py-1.5 flex items-center justify-around">
          {[
            { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
            { to: '/today', label: 'Today', icon: CalendarCheck },
            { to: '/gate-plan', label: 'GATE', icon: BookOpen },
            { to: '/fitness', label: 'Fitness', icon: Dumbbell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                  isActive ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={() => setMobileMoreOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </nav>
      </div>

      {/* Mobile "More" Drawer Modal */}
      {mobileMoreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-900 border-t border-dark-750 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-4">
              <span className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                ALL SECTIONS
              </span>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold border transition ${
                        isActive
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                          : 'bg-dark-850 text-slate-300 border-dark-750 hover:bg-dark-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-orange-400" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <button
              onClick={() => {
                setMobileMoreOpen(false);
                logout();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        onSuccess={handleQuickSuccess}
      />
    </div>
  );
};
