import { useEffect, useState } from 'react';
import {
  Alert, Box, Card, CardContent, Chip, Grid, Paper, Stack, Typography, CircularProgress, LinearProgress
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';

export function AnalyticsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    archived: 0,
    byPriority: { urgent: 0, high: 0, medium: 0, low: 0 },
    byCategory: {},
    completionRate: 0,
    overdueTasks: 0,
    upcomingDeadlines: [],
    avgTimeRequired: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/v1/tasks');
        const allTasks = res.data.data;
        setTasks(allTasks);

        // Calculate analytics
        const now = new Date();
        const pending = allTasks.filter(t => t.status === 'pending' && !t.archived);
        const completed = allTasks.filter(t => t.status === 'completed' && !t.archived);
        const archived = allTasks.filter(t => t.archived);
        const total = allTasks.filter(t => !t.archived).length;

        const byPriority = {
          urgent: allTasks.filter(t => t.priority === 'urgent' && !t.archived).length,
          high: allTasks.filter(t => t.priority === 'high' && !t.archived).length,
          medium: allTasks.filter(t => t.priority === 'medium' && !t.archived).length,
          low: allTasks.filter(t => t.priority === 'low' && !t.archived).length,
        };

        const byCategory = allTasks
          .filter(t => !t.archived)
          .reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
          }, {});

        const completionRate = total > 0 ? (completed.length / total) * 100 : 0;

        const overdueTasks = pending.filter(t => t.deadline && new Date(t.deadline) < now).length;

        const upcomingDeadlines = allTasks
          .filter(t => !t.archived && t.status === 'pending' && t.deadline)
          .filter(t => new Date(t.deadline) > now && new Date(t.deadline) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);

        const tasksWithTime = allTasks.filter(t => t.time_required);
        const avgTimeRequired = tasksWithTime.length > 0
          ? tasksWithTime.reduce((sum, t) => sum + t.time_required, 0) / tasksWithTime.length
          : 0;

        setAnalytics({
          total,
          pending: pending.length,
          completed: completed.length,
          archived: archived.length,
          byPriority,
          byCategory,
          completionRate,
          overdueTasks,
          upcomingDeadlines,
          avgTimeRequired,
        });
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive insights into your task management
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Tasks</Typography>
                  <Typography variant="h3" fontWeight={800}>{analytics.total}</Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
                  <Typography variant="h3" fontWeight={800}>{analytics.pending}</Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Completed</Typography>
                  <Typography variant="h3" fontWeight={800}>{analytics.completed}</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Archived</Typography>
                  <Typography variant="h3" fontWeight={800}>{analytics.archived}</Typography>
                </Box>
                <BarChartIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Completion Rate */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Completion Rate
          </Typography>
          <Stack direction="row" alignItems="center" gap={2}>
            <LinearProgress
              variant="determinate"
              value={analytics.completionRate}
              sx={{ flex: 1, height: 12, borderRadius: 2 }}
            />
            <Typography variant="h6" fontWeight={700} color="primary">
              {analytics.completionRate.toFixed(1)}%
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {analytics.completed} of {analytics.total} tasks completed
          </Typography>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon /> Tasks by Priority
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                <Typography variant="h4" fontWeight={800}>{analytics.byPriority.urgent}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Urgent</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                <Typography variant="h4" fontWeight={800}>{analytics.byPriority.high}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>High</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                <Typography variant="h4" fontWeight={800}>{analytics.byPriority.medium}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Medium</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.400', color: 'white' }}>
                <Typography variant="h4" fontWeight={800}>{analytics.byPriority.low}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Low</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Categories */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Tasks by Category
              </Typography>
              {Object.keys(analytics.byCategory).length === 0 ? (
                <Typography color="text.secondary">No categories found</Typography>
              ) : (
                <Stack gap={1.5} sx={{ mt: 2 }}>
                  {Object.entries(analytics.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <Stack key={category} direction="row" justifyContent="space-between" alignItems="center">
                        <Chip label={category} variant="outlined" />
                        <Chip label={count} color="primary" sx={{ fontWeight: 700 }} />
                      </Stack>
                    ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Upcoming Deadlines (Next 7 Days)
              </Typography>
              {analytics.upcomingDeadlines.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 2 }}>No upcoming deadlines</Typography>
              ) : (
                <Stack gap={1.5} sx={{ mt: 2 }}>
                  {analytics.upcomingDeadlines.map((task) => (
                    <Paper key={task._id} sx={{ p: 1.5, bgcolor: 'background.default' }}>
                      <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(task.deadline).format('MMM DD, YYYY HH:mm')}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Overdue Tasks
              </Typography>
              <Typography variant="h3" fontWeight={800} color={analytics.overdueTasks > 0 ? 'error.main' : 'success.main'}>
                {analytics.overdueTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.overdueTasks > 0 ? 'Tasks past their deadline' : 'All tasks are on track!'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Average Time Required
              </Typography>
              <Typography variant="h3" fontWeight={800} color="primary.main">
                {analytics.avgTimeRequired.toFixed(0)} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average time to complete a task
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
