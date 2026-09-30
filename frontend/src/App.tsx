import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layouts/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TodayPage } from './pages/TodayPage';
import { GatePlanPage } from './pages/GatePlanPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { StudyPage } from './pages/StudyPage';
import { FitnessPage } from './pages/FitnessPage';
import { SleepPage } from './pages/SleepPage';
import { NutritionPage } from './pages/NutritionPage';
import { PhoneUsagePage } from './pages/PhoneUsagePage';
import { HabitsPage } from './pages/HabitsPage';
import { PYQPage } from './pages/PYQPage';
import { RevisionsPage } from './pages/RevisionsPage';
import { ExtraTasksPage } from './pages/ExtraTasksPage';
import { MocksPage } from './pages/MocksPage';
import { DailyReviewPage } from './pages/DailyReviewPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotesPage } from './pages/NotesPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-slate-400 font-mono text-xs">
        CONNECTING TO WINTER ARC COMMAND CENTER...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="gate-plan" element={<GatePlanPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="fitness" element={<FitnessPage />} />
        <Route path="sleep" element={<SleepPage />} />
        <Route path="nutrition" element={<NutritionPage />} />
        <Route path="phone-usage" element={<PhoneUsagePage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="pyqs" element={<PYQPage />} />
        <Route path="revisions" element={<RevisionsPage />} />
        <Route path="extra" element={<ExtraTasksPage />} />
        <Route path="mocks" element={<MocksPage />} />
        <Route path="daily-review" element={<DailyReviewPage />} />
        <Route path="weekly-review" element={<WeeklyReviewPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
