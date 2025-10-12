import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';

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

      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t._id} hover>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.deadline ? dayjs(t.deadline).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                  <TableCell><Chip size="small" label={t.priority} color={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'default'} /></TableCell>
                  <TableCell>
                    <Chip size="small" label={t.status} color={t.status === 'completed' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit"><IconButton onClick={() => { setEditingId(t._id); setForm({ ...t, deadline: t.deadline ? dayjs(t.deadline).format('YYYY-MM-DDTHH:mm') : '' }); setOpen(true); }}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title={t.status === 'completed' ? 'Mark pending' : 'Mark complete'}>
                      <IconButton onClick={() => onToggleStatus(t._id, t.status)}>
                        {t.status === 'completed' ? <UndoIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => onDelete(t._id)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</Button>
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>Page {page}</Box>
            <Button onClick={() => setPage(p => p + 1)}>Next</Button>
          </Stack>
        </CardContent>
      </Card>

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
    </Stack>
  );
}
