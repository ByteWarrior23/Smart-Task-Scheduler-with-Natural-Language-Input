import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Loading } from './components/common/Loading';

// Lazy load pages for better performance
const TasksPage = React.lazy(() => import('./pages/tasks/TasksPage').then(m => ({ default: m.TasksPage })));
const TaskDetailPage = React.lazy(() => import('./pages/tasks/TaskDetailPage').then(m => ({ default: m.TaskDetailPage })));
const RecurringTasksPage = React.lazy(() => import('./pages/tasks/RecurringTasksPage').then(m => ({ default: m.RecurringTasksPage })));
const ArchivedTasksPage = React.lazy(() => import('./pages/tasks/ArchivedTasksPage').then(m => ({ default: m.ArchivedTasksPage })));
const AnalyticsPage = React.lazy(() => import('./pages/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route wrapper (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={
          <React.Suspense fallback={<Loading />}>
            <TasksPage />
          </React.Suspense>
        } />
        <Route path="/tasks/:taskId" element={
          <React.Suspense fallback={<Loading />}>
            <TaskDetailPage />
          </React.Suspense>
        } />
        <Route path="/tasks/recurring" element={
          <React.Suspense fallback={<Loading />}>
            <RecurringTasksPage />
          </React.Suspense>
        } />
        <Route path="/tasks/archived" element={
          <React.Suspense fallback={<Loading />}>
            <ArchivedTasksPage />
          </React.Suspense>
        } />
        <Route path="/analytics" element={
          <React.Suspense fallback={<Loading />}>
            <AnalyticsPage />
          </React.Suspense>
        } />
        <Route path="/settings" element={
          <React.Suspense fallback={<Loading />}>
            <SettingsPage />
          </React.Suspense>
        } />
        <Route path="/profile" element={
          <React.Suspense fallback={<Loading />}>
            <ProfilePage />
          </React.Suspense>
        } />
        <Route path="/reminders" element={
          <React.Suspense fallback={<Loading />}>
            <Dashboard />
          </React.Suspense>
        } />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
