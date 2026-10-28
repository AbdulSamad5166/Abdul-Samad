import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Spinner } from '../components/ui/Spinner';

// Lazy-loaded pages for optimal performance & code splitting
const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const TasksPage = lazy(() =>
  import('../pages/TasksPage').then((m) => ({ default: m.TasksPage }))
);
const TaskDetailPage = lazy(() =>
  import('../pages/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage }))
);
const TaskFormPage = lazy(() =>
  import('../pages/TaskFormPage').then((m) => ({ default: m.TaskFormPage }))
);
const BoardPage = lazy(() =>
  import('../pages/BoardPage').then((m) => ({ default: m.BoardPage }))
);
const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const CalendarPage = lazy(() =>
  import('../pages/CalendarPage').then((m) => ({ default: m.CalendarPage }))
);
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoadingFallback: React.FC = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" className="text-primary" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Loading view...
      </span>
    </div>
  </div>
);

/**
 * ProtectedRoute component: ensures user is logged in before rendering route.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * PublicRoute component: prevents authenticated users from visiting /login or /register.
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/new" element={<TaskFormPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
