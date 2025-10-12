import { useEffect, useState } from 'react';
import { api } from '../../../shared/api/client';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';

export function JobsPage() {
  const [stats, setStats] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get('/api/v1/tasks/reminders/stats');
      setStats(res.data.data);
    } catch (e) { setError(e?.response?.data?.message || 'Failed to load stats'); }
  };

  const checkDeadlines = async () => {
    try {
      const res = await api.get('/api/v1/tasks/deadlines/check');
      setDeadlines(res.data.data);
    } catch (e) { setError(e?.response?.data?.message || 'Failed to check deadlines'); }
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <Stack gap={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}>
            <Typography variant="h6" fontWeight={700}>Reminder Stats</Typography>
            <Button onClick={loadStats}>Refresh</Button>
          </Stack>
          {stats && <pre style={{ background: '#0b1020', color: '#90ee90', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(stats, null, 2)}</pre>}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}>
            <Typography variant="h6" fontWeight={700}>Deadline Check</Typography>
            <Button onClick={checkDeadlines}>Run Check</Button>
          </Stack>
          {deadlines && <pre style={{ background: '#0b1020', color: '#90ee90', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(deadlines, null, 2)}</pre>}
        </CardContent>
      </Card>
    </Stack>
  );
}
