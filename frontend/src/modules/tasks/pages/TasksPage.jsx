import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, MenuItem, Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography, Fade, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('created');
  const [tabValue, setTabValue] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60, natural_language_input: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/v1/tasks';
      if (query) url = `/api/v1/tasks/search?query=${encodeURIComponent(query)}`;
      else if (category) url = `/api/v1/tasks/category/${encodeURIComponent(category)}`;
      else if (sort === 'deadline-asc') url = '/api/v1/tasks/sort/deadline';
      else if (sort === 'priority') url = '/api/v1/tasks/sort/priority';
      else if (sort === 'created') url = '/api/v1/tasks/sort/created';
      else if (sort === 'time') url = '/api/v1/tasks/sort/time-required';
      
      const res = await api.get(url);
      let allTasks = res.data.data.filter(t => !t.archived);

      // Calculate stats
      setStats({
        total: allTasks.length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        completed: allTasks.filter(t => t.status === 'completed').length,
      });

      // Filter by tab
      if (tabValue === 'pending') allTasks = allTasks.filter(t => t.status === 'pending');
      else if (tabValue === 'completed') allTasks = allTasks.filter(t => t.status === 'completed');

      setTasks(allTasks);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [query, category, sort, tabValue]);

  const onCreate = async () => {
    try {
      const payload = { ...form, deadline: form.deadline || null };
      if (form.natural_language_input) {
        payload.natural_language_input = form.natural_language_input;
      }
      await api.post('/api/v1/tasks', payload);
      setOpen(false);
      setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60, natural_language_input: '' });
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Create failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onUpdate = async () => {
    if (!editingId) return;
    try {
      await api.patch(`/api/v1/tasks/${editingId}`, { ...form, deadline: form.deadline || null });
      setOpen(false);
      setEditingId(null);
      setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60, natural_language_input: '' });
      setSuccess('Task updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Update failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this task permanently?')) return;
    try {
      await api.delete(`/api/v1/tasks/${id}`);
      setSuccess('Task deleted!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onToggleStatus = async (id, status) => {
    const path = status === 'pending' ? 'complete' : 'pending';
    try {
      await api.patch(`/api/v1/tasks/${id}/${path}`);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Status update failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onArchive = async (id) => {
    try {
      await api.patch(`/api/v1/tasks/${id}/archive`);
      setSuccess('Task archived!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Archive failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <Stack gap={3}>
      {/* Header with Stats */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Tasks Dashboard
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>Total Tasks</Typography>
              <Typography variant="h3" fontWeight={800}>{stats.total}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: 'white', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>Pending</Typography>
              <Typography variant="h3" fontWeight={800}>{stats.pending}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: 'white', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>Completed</Typography>
              <Typography variant="h3" fontWeight={800}>{stats.completed}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Filters and Actions */}
      <Card elevation={2}>
        <CardContent>
          <Stack gap={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}>
              <TextField
                label="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ width: { xs: '100%', sm: 200 } }}
                InputProps={{
                  startAdornment: <FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                select
                label="Sort By"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ width: { xs: '100%', sm: 220 } }}
              >
                <MenuItem value="created">Created Date</MenuItem>
                <MenuItem value="deadline-asc">Deadline (Soonest)</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="time">Time Required</MenuItem>
              </TextField>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60, natural_language_input: '' });
                  setEditingId(null);
                  setOpen(true);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  minWidth: { xs: '100%', sm: 'auto' },
                }}
              >
                New Task
              </Button>
            </Stack>

            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="All Tasks" value="all" />
              <Tab label="Pending" value="pending" />
              <Tab label="Completed" value="completed" />
            </Tabs>
          </Stack>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Fade in>
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </Fade>
      )}
      {success && (
        <Fade in>
          <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
        </Fade>
      )}

      {/* Tasks Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No tasks found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create a new task to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task._id}>
              <Fade in>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}
                      />
                      <Chip
                        label={task.status}
                        color={task.status === 'completed' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>

                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, color: 'text.primary' }}>
                      {task.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        flex: 1,
                      }}
                    >
                      {task.description}
                    </Typography>

                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <Chip label={task.category} size="small" variant="outlined" />
                      {task.time_required && (
                        <Chip label={`${task.time_required} min`} size="small" variant="outlined" />
                      )}
                    </Stack>

                    {task.deadline && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        📅 {dayjs(task.deadline).format('MMM DD, YYYY HH:mm')}
                      </Typography>
                    )}

                    <Stack direction="row" gap={0.5} sx={{ mt: 'auto', pt: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => navigate(`/tasks/${task._id}`)} color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(task._id);
                            setForm({
                              title: task.title,
                              description: task.description,
                              deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DDTHH:mm') : '',
                              priority: task.priority,
                              category: task.category,
                              time_required: task.time_required || 60,
                              natural_language_input: '',
                            });
                            setOpen(true);
                          }}
                          color="info"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}>
                        <IconButton size="small" onClick={() => onToggleStatus(task._id, task.status)} color="success">
                          {task.status === 'completed' ? <UndoIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Archive">
                        <IconButton size="small" onClick={() => onArchive(task._id)} color="warning">
                          <ArchiveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(task._id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {editingId ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2.5} mt={1}>
            <TextField
              label="Natural Language Input (optional)"
              value={form.natural_language_input}
              onChange={(e) => setForm((f) => ({ ...f, natural_language_input: e.target.value }))}
              placeholder="e.g., 'Finish project report by Friday at 5pm, high priority'"
              multiline
              rows={2}
              helperText="Describe your task naturally - we'll parse it for you!"
            />
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              rows={3}
              required
            />
            <TextField
              type="datetime-local"
              label="Deadline"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                select
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                sx={{ flex: 1 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </TextField>
              <TextField
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                label="Time (minutes)"
                value={form.time_required}
                onChange={(e) => setForm((f) => ({ ...f, time_required: Number(e.target.value) }))}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editingId ? onUpdate : onCreate}
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
