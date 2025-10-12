import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography, Fade, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import CommentIcon from '@mui/icons-material/Comment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import dayjs from 'dayjs';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [openReminder, setOpenReminder] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const taskRes = await api.get(`/api/v1/tasks/${taskId}`);
      setTask(taskRes.data.data);

      const commentsRes = await api.get(`/api/v1/tasks/${taskId}/comments`);
      setComments(commentsRes.data.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const onAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/api/v1/tasks/${taskId}/comments`, { comment: commentText });
      setCommentText('');
      setSuccess('Comment added!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTask();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add comment');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onScheduleReminder = async () => {
    if (!reminderTime) {
      setError('Please select a reminder time');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      await api.post(`/api/v1/tasks/${taskId}/reminder`, { reminderTime });
      setSuccess('Reminder scheduled!');
      setOpenReminder(false);
      setReminderTime('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to schedule reminder');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onToggleStatus = async () => {
    const path = task.status === 'pending' ? 'complete' : 'pending';
    try {
      await api.patch(`/api/v1/tasks/${taskId}/${path}`);
      await fetchTask();
    } catch (e) {
      setError(e?.response?.data?.message || 'Status update failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onToggleArchive = async () => {
    const path = task.archived ? 'unarchive' : 'archive';
    try {
      await api.patch(`/api/v1/tasks/${taskId}/${path}`);
      setSuccess(task.archived ? 'Task unarchived!' : 'Task archived!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchTask();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update archive status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onDelete = async () => {
    if (!confirm('Delete this task permanently?')) return;
    try {
      await api.delete(`/api/v1/tasks/${taskId}`);
      navigate('/tasks');
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !task) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!task) return null;

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
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/tasks')}
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to Tasks
      </Button>

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

      {/* Main Task Card */}
      <Card elevation={3}>
        <CardContent>
          <Stack gap={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
              <Box flex={1}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {task.title}
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    icon={<PriorityHighIcon />}
                    sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                  />
                  <Chip
                    label={task.status}
                    color={task.status === 'completed' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                  {task.archived && (
                    <Chip label="ARCHIVED" sx={{ fontWeight: 600, bgcolor: 'grey.300' }} />
                  )}
                  {task.recurring && (
                    <Chip label="RECURRING" color="primary" sx={{ fontWeight: 600 }} />
                  )}
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" gap={1}>
                <Tooltip title="Edit">
                  <IconButton color="info" onClick={() => navigate('/tasks')}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}>
                  <IconButton color="success" onClick={onToggleStatus}>
                    {task.status === 'completed' ? <UndoIcon /> : <CheckCircleIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={task.archived ? 'Unarchive' : 'Archive'}>
                  <IconButton color="warning" onClick={onToggleArchive}>
                    {task.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Schedule Reminder">
                  <IconButton color="primary" onClick={() => setOpenReminder(true)}>
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={onDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Divider />

            {/* Task Details */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Description</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {task.description}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <CategoryIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Category</Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={700}>{task.category}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Time Required</Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={700}>
                    {task.time_required ? `${task.time_required} min` : 'Not specified'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Created</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={600}>
                    {dayjs(task.createdAt).format('MMM DD, YYYY')}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: task.deadline ? 'warning.light' : 'background.default', height: '100%' }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon color={task.deadline ? 'warning' : 'primary'} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Deadline</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={600}>
                    {task.deadline ? dayjs(task.deadline).format('MMM DD, YYYY HH:mm') : 'No deadline'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {task.natural_language_input && (
              <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  Original Natural Language Input
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{task.natural_language_input}"
                </Typography>
              </Paper>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommentIcon /> Comments ({comments.length})
          </Typography>

          {/* Add Comment */}
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
            <TextField
              fullWidth
              label="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              multiline
              rows={2}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onAddComment();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={onAddComment}
              disabled={!commentText.trim()}
              sx={{ minWidth: 120, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
            >
              Add
            </Button>
          </Stack>

          {/* Comments List */}
          {comments.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            <Stack gap={2}>
              {comments.map((comment, idx) => (
                <Paper key={idx} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body1">{comment}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog open={openReminder} onClose={() => setOpenReminder(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Schedule Reminder</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <TextField
              type="datetime-local"
              label="Reminder Time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              You'll receive a reminder at the specified time
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenReminder(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={onScheduleReminder}
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
