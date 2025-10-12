import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { PageHeader } from '../../../shared/components/PageHeader';
import { useState } from 'react';
import { api } from '../../../shared/api/client';

export function AdminPage() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  const sendWelcome = async () => {
    setError(null); setNote(null);
    try {
      const res = await api.post('/api/v1/tasks/send-welcome-email', { email });
      setNote(res.data.message);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send');
    }
  };

  return (
    <Box maxWidth={560} mx="auto" mt={4}>
      <PageHeader title="Admin Tools" subtitle="Operational tools and diagnostics" />
      <Card>
        <CardContent>
          <Stack gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {note && <Alert severity="success">{note}</Alert>}
            <TextField label="Welcome email to" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="contained" onClick={sendWelcome}>Send welcome email</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
