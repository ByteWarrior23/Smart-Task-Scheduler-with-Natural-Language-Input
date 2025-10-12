import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, IconButton, Stack, TextField, Tooltip, Typography, Fade, CircularProgress
} from '@mui/material';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export function ArchivePage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/tasks');
      const archived = res.data.data.filter(t => t.archived);
      setTasks(archived);
      setFilteredTasks(archived);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to fetch archived tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchQuery, tasks]);

  const onUnarchive = async (id) => {
    try {
      await api.patch(`/api/v1/tasks/${id}/unarchive`);
      setSuccess('Task unarchived successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchArchivedTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Unarchive failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Permanently delete this task?')) return;
    try {
      await api.delete(`/api/v1/tasks/${id}`);
      setSuccess('Task deleted permanently!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchArchivedTasks();
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
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
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Archived Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your archived tasks - restore or permanently delete them
        </Typography>
      </Box>

      {/* Search */}
      <Card elevation={2}>
        <CardContent>
          <TextField
            fullWidth
            label="Search archived tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
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

      {/* Tasks */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No archived tasks</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchQuery ? 'No tasks match your search' : 'Archive tasks from the main tasks page'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task._id}>
              <Fade in>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    opacity: 0.85,
                    '&:hover': {
                      opacity: 1,
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
                        label="ARCHIVED"
                        size="small"
                        sx={{ fontWeight: 600, bgcolor: 'grey.300' }}
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
                      <Tooltip title="Unarchive">
                        <IconButton size="small" onClick={() => onUnarchive(task._id)} color="success">
                          <UnarchiveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Permanently">
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
    </Stack>
  );
}
