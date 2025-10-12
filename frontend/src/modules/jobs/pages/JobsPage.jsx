import { useEffect, useState } from 'react';
import { api } from '../../../shared/api/client';
import {
  Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography, Fade, CircularProgress
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';

export function JobsPage() {
  const [stats, setStats] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/tasks/reminders/stats');
      setStats(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load stats');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoadingStats(false);
    }
  };

  const checkDeadlines = async () => {
    setLoadingDeadlines(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/tasks/deadlines/check');
      setDeadlines(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to check deadlines');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoadingDeadlines(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Jobs & Reminders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor reminder statistics and check for upcoming/overdue deadlines
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Fade in>
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </Fade>
      )}

      {/* Reminder Stats */}
      <Card elevation={3}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsActiveIcon color="primary" /> Reminder Statistics
            </Typography>
            <Button
              variant="outlined"
              startIcon={loadingStats ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={loadStats}
              disabled={loadingStats}
            >
              Refresh
            </Button>
          </Stack>

          {loadingStats && !stats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : stats ? (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Reminders</Typography>
                    <Typography variant="h3" fontWeight={800}>{stats.totalReminders || 0}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: 'white' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Sent Today</Typography>
                    <Typography variant="h3" fontWeight={800}>{stats.sentToday || 0}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: 'white' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
                    <Typography variant="h3" fontWeight={800}>{stats.pending || 0}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Paper
                sx={{
                  p: 3,
                  bgcolor: '#0f172a',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </Paper>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No statistics available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Deadline Check */}
      <Card elevation={3}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="warning" /> Deadline Check
            </Typography>
            <Button
              variant="contained"
              startIcon={loadingDeadlines ? <CircularProgress size={20} /> : <WarningAmberIcon />}
              onClick={checkDeadlines}
              disabled={loadingDeadlines}
              sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
            >
              Run Check
            </Button>
          </Stack>

          {loadingDeadlines && !deadlines ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : deadlines ? (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Upcoming Deadlines</Typography>
                    <Typography variant="h3" fontWeight={800}>
                      {Array.isArray(deadlines.upcoming) ? deadlines.upcoming.length : 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2.5, textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Overdue Tasks</Typography>
                    <Typography variant="h3" fontWeight={800}>
                      {Array.isArray(deadlines.overdue) ? deadlines.overdue.length : 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {deadlines.total > 0 && (
                <Alert severity="info" icon={<ScheduleIcon />} sx={{ mb: 2 }}>
                  Total {deadlines.total} task(s) require attention
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Paper
                sx={{
                  p: 3,
                  bgcolor: '#0f172a',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(deadlines, null, 2)}
                </pre>
              </Paper>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Click "Run Check" to check for upcoming and overdue deadlines
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            ℹ️ About Jobs & Reminders
          </Typography>
          <Stack component="ul" sx={{ m: 0, pl: 2.5 }} gap={0.5}>
            <Typography component="li" variant="body2">
              Reminder statistics show the health of your notification system
            </Typography>
            <Typography component="li" variant="body2">
              Deadline checks identify tasks that need immediate attention
            </Typography>
            <Typography component="li" variant="body2">
              Background jobs run automatically to send reminders on schedule
            </Typography>
            <Typography component="li" variant="body2">
              Use the refresh buttons to get the latest data
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
