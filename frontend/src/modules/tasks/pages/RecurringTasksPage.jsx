import { useEffect, useState } from 'react';
import { api } from '../../../shared/api/client';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, MenuItem, Paper, Stack, TextField, Tooltip, Typography, Fade, CircularProgress
} from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';

export function RecurringTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    rrule_string: '',
    priority: 'medium',
    category: 'general',
    time_required: 60,
    end_date: ''
  });
  const [selectedId, setSelectedId] = useState('');
  const [updateType, setUpdateType] = useState('all');
  const [deleteType, setDeleteType] = useState('all');
  const [editMode, setEditMode] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/tasks/recurring');
      setTasks(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load recurring tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createRecurring = async () => {
    try {
      await api.post('/api/v1/tasks/recurring', {
        ...form,
        deadline: form.deadline || null,
        end_date: form.end_date || null
      });
      setForm({
        title: '',
        description: '',
        deadline: '',
        rrule_string: '',
        priority: 'medium',
        category: 'general',
        time_required: 60,
        end_date: ''
      });
      setOpen(false);
      setSuccess('Recurring task created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Create failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const updateRecurring = async () => {
    if (!selectedId) {
      setError('Please select a task');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      await api.put(`/api/v1/tasks/recurring/${selectedId}`, { ...form, update_type: updateType });
      setSuccess('Recurring task updated!');
      setTimeout(() => setSuccess(null), 3000);
      setOpen(false);
      setEditMode(false);
      setSelectedId('');
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Update failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const deleteRecurring = async (id) => {
    if (!confirm('Delete this recurring task series?')) return;
    try {
      await api.delete(`/api/v1/tasks/recurring/${id}`, { data: { delete_type: deleteType } });
      setSuccess('Recurring task deleted!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const rruleExamples = [
    { label: 'Daily', value: 'FREQ=DAILY' },
    { label: 'Weekly (Mon, Wed, Fri)', value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' },
    { label: 'Monthly (1st)', value: 'FREQ=MONTHLY;BYMONTHDAY=1' },
    { label: 'Every Weekday', value: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' },
  ];

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Recurring Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set up tasks that repeat on a schedule using RRULE patterns
        </Typography>
      </Box>

      {/* Create Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setForm({
            title: '',
            description: '',
            deadline: '',
            rrule_string: '',
            priority: 'medium',
            category: 'general',
            time_required: 60,
            end_date: ''
          });
          setEditMode(false);
          setSelectedId('');
          setOpen(true);
        }}
        sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', alignSelf: 'flex-start' }}
      >
        Create Recurring Task
      </Button>

      {/* RRULE Examples */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RepeatIcon /> RRULE Pattern Examples
          </Typography>
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            {rruleExamples.map((example) => (
              <Grid item xs={12} sm={6} key={example.label}>
                <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                  <Typography variant="body2" fontWeight={600}>{example.label}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {example.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
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

      {/* Tasks List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No recurring tasks</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create your first recurring task to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <Fade in>
                <Card
                  elevation={2}
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Stack gap={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" fontWeight={700}>{task.title}</Typography>
                        <Chip
                          icon={<RepeatIcon />}
                          label="Recurring"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>

                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <Chip label={task.priority} size="small" color={
                          task.priority === 'urgent' ? 'error' :
                          task.priority === 'high' ? 'warning' :
                          task.priority === 'medium' ? 'info' : 'default'
                        } />
                        <Chip label={task.category} size="small" variant="outlined" />
                        {task.time_required && (
                          <Chip label={`${task.time_required} min`} size="small" variant="outlined" />
                        )}
                      </Stack>

                      {task.deadline && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          📅 First: {dayjs(task.deadline).format('MMM DD, YYYY HH:mm')}
                        </Typography>
                      )}

                      <Paper sx={{ p: 1, bgcolor: 'background.default' }}>
                        <Typography variant="caption" color="text.secondary">RRULE Pattern:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {task.rrule_string || 'N/A'}
                        </Typography>
                      </Paper>

                      <Stack direction="row" gap={0.5} sx={{ mt: 1 }}>
                        <Tooltip title="View Instances">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => {
                              setSelectedId(task._id);
                              setForm({
                                title: task.title,
                                description: task.description,
                                deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DDTHH:mm') : '',
                                rrule_string: task.rrule_string,
                                priority: task.priority,
                                category: task.category,
                                time_required: task.time_required || 60,
                                end_date: '',
                              });
                              setEditMode(true);
                              setOpen(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Series">
                          <IconButton size="small" color="error" onClick={() => deleteRecurring(task._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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
          {editMode ? 'Edit Recurring Task' : 'Create Recurring Task'}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2.5} mt={1}>
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
              rows={2}
              required
            />
            <TextField
              type="datetime-local"
              label="First Instance Deadline"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="RRULE Pattern"
              value={form.rrule_string}
              onChange={(e) => setForm((f) => ({ ...f, rrule_string: e.target.value }))}
              placeholder="e.g., FREQ=WEEKLY;BYDAY=MO,WE,FR"
              helperText="Define the recurrence pattern"
              required
            />
            <TextField
              type="date"
              label="End Date (optional)"
              value={form.end_date}
              onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
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
            {editMode && (
              <TextField
                select
                label="Update Type"
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value)}
                helperText="Choose which instances to update"
              >
                <MenuItem value="this">This instance only</MenuItem>
                <MenuItem value="following">This and following</MenuItem>
                <MenuItem value="all">All instances</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editMode ? updateRecurring : createRecurring}
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
