import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Theme and Components
import { AppThemeProvider } from './shared/theme/theme.jsx';
import Navbar from './shared/components/Navbar';
import { AuthProvider } from './modules/auth/AuthProvider';

// Pages
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import DashboardPage from './modules/app/pages/DashboardPage';
import TasksPage from './modules/tasks/pages/TasksPage';
import VoicePage from './modules/voice/pages/VoicePage';
import AdminPage from './modules/admin/pages/AdminPage';
import JobsPage from './modules/jobs/pages/JobsPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = React.useContext(React.createContext()); // This will be replaced with actual auth context
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Page Transition Component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Main App Component
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              {/* Navigation */}
              <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
              
              {/* Main Content */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  ml: { md: '280px' }, // Account for drawer width
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  minHeight: '100vh',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none',
                  },
                }}
              >
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Auth Routes */}
                    <Route 
                      path="/login" 
                      element={
                        <PageTransition>
                          <LoginPage />
                        </PageTransition>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <PageTransition>
                          <RegisterPage />
                        </PageTransition>
                      } 
                    />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <PageTransition>
                            <DashboardPage />
                          </PageTransition>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tasks" 
                      element={
                        <ProtectedRoute>
                          <PageTransition>
                            <TasksPage />
                          </PageTransition>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/voice" 
                      element={
                        <ProtectedRoute>
                          <PageTransition>
                            <VoicePage />
                          </PageTransition>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/jobs" 
                      element={
                        <ProtectedRoute>
                          <PageTransition>
                            <JobsPage />
                          </PageTransition>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute adminOnly>
                          <PageTransition>
                            <AdminPage />
                          </PageTransition>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* 404 Route */}
                    <Route 
                      path="*" 
                      element={
                        <PageTransition>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100vh',
                              textAlign: 'center',
                            }}
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, type: 'spring' }}
                            >
                              <Typography variant="h1" sx={{ fontSize: '8rem', mb: 2 }}>
                                🚫
                              </Typography>
                            </motion.div>
                            <Typography variant="h3" className="gradient-text" sx={{ mb: 2 }}>
                              Page Not Found
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                              The page you're looking for doesn't exist.
                            </Typography>
                            <Button
                              variant="contained"
                              size="large"
                              onClick={() => window.history.back()}
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                },
                              }}
                            >
                              Go Back
                            </Button>
                          </Box>
                        </PageTransition>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </Box>
            </Box>
          </Router>
          
          {/* React Query Devtools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
