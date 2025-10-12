import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CategoryIcon from '@mui/icons-material/Category';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('created');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60 });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchTasks = async () => {
    setLoading(true); setError(null);
    try {
      let url = '/api/v1/tasks';
      if (query) url = `/api/v1/tasks/search?query=${encodeURIComponent(query)}`;
      else if (category) url = `/api/v1/tasks/category/${encodeURIComponent(category)}`;
      else if (sort === 'deadline-asc') url = '/api/v1/tasks/sort/deadline';
      else if (sort === 'priority') url = '/api/v1/tasks/sort/priority';
      else if (sort === 'created') url = '/api/v1/tasks/sort/created';
      else if (sort === 'time') url = '/api/v1/tasks/sort/time-required';
      const res = await api.get(url);
      const full = res.data.data;
      const start = (page - 1) * pageSize;
      setTasks(full.slice(start, start + pageSize));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to fetch tasks');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [query, category, sort, page, pageSize]);

  const onCreate = async () => {
    try {
      await api.post('/api/v1/tasks', { ...form, deadline: form.deadline || null });
      setOpen(false); setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60 }); await fetchTasks();
    } catch (e) {
      alert(e?.response?.data?.message || 'Create failed');
    }
  };

  const onUpdate = async () => {
    if (!editingId) return;
    try {
      await api.patch(`/api/v1/tasks/${editingId}`, { ...form, deadline: form.deadline || null });
      setOpen(false); setEditingId(null); setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60 }); await fetchTasks();
    } catch (e) { alert(e?.response?.data?.message || 'Update failed'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete task?')) return;
    await api.delete(`/api/v1/tasks/${id}`); await fetchTasks();
  };

  const onToggleStatus = async (id, status) => {
    const path = status === 'pending' ? 'complete' : 'pending';
    await api.patch(`/api/v1/tasks/${id}/${path}`); await fetchTasks();
  };

  const onAddComment = async (id) => {
    await api.post(`/api/v1/tasks/${id}/comments`, { comment: commentText });
    setCommentText(''); await fetchTasks();
  };

  return (
    <Stack gap={2}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}>
            <TextField label="Search" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ width: 200 }} />
            <TextField select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ width: 220 }}>
              <MenuItem value="created">Created</MenuItem>
              <MenuItem value="deadline-asc">Deadline (asc)</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="time">Time Required</MenuItem>
            </TextField>
            <TextField select label="Page size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} sx={{ width: 160 }}>
              {[5,10,20,50].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60 }); setEditingId(null); setOpen(true); }}>New Task</Button>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {tasks.map((t, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={t._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: t.priority === 'urgent' ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)' :
                             t.priority === 'high' ? 'linear-gradient(135deg, #ffa726, #fb8c00)' :
                             t.priority === 'medium' ? 'linear-gradient(135deg, #42a5f5, #1976d2)' :
                             'linear-gradient(135deg, #66bb6a, #388e3c)',
                  color: 'white',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s' },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {t.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <ScheduleIcon fontSize="small" />
                    <Typography variant="body2">
                      {t.deadline ? dayjs(t.deadline).format('MMM DD, HH:mm') : 'No deadline'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PriorityHighIcon fontSize="small" />
                    <Chip size="small" label={t.priority} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CategoryIcon fontSize="small" />
                    <Typography variant="body2">{t.category}</Typography>
                  </Stack>
                  <Chip
                    size="small"
                    label={t.status}
                    sx={{
                      bgcolor: t.status === 'completed' ? 'rgba(76,175,80,0.8)' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      mt: 1
                    }}
                  />
                </CardContent>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingId(t._id); setForm({ ...t, deadline: t.deadline ? dayjs(t.deadline).format('YYYY-MM-DDTHH:mm') : '' }); setOpen(true); }} sx={{ color: 'white' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t.status === 'completed' ? 'Mark pending' : 'Mark complete'}>
                    <IconButton size="small" onClick={() => onToggleStatus(t._id, t.status)} sx={{ color: 'white' }}>
                      {t.status === 'completed' ? <UndoIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(t._id)} sx={{ color: 'white' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" justifyContent="center" mt={3}>
        <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</Button>
        <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>Page {page}</Box>
        <Button onClick={() => setPage(p => p + 1)}>Next</Button>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <TextField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <TextField type="datetime-local" label="Deadline" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField select label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </TextField>
            <TextField label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            <TextField type="number" label="Time required (min)" value={form.time_required} onChange={(e) => setForm((f) => ({ ...f, time_required: Number(e.target.value) }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={editingId ? onUpdate : onCreate}>{editingId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Quick Comment</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mt={1}>
            <TextField label="Task ID" placeholder="Task ID" onChange={(e) => setEditingId(e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ flex: 2 }} />
            <Button variant="outlined" onClick={() => editingId && onAddComment(editingId)}>Add Comment</Button>
          </Stack>
        </CardContent>
      </Card>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => { setForm({ title: '', description: '', deadline: '', priority: 'medium', category: 'general', time_required: 60 }); setEditingId(null); setOpen(true); }}>
        <AddIcon />
      </Fab>
    </Stack>
  );
}
