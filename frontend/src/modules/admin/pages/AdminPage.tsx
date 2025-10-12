import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { api } from '../../../shared/api/client';

export function AdminPage() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendWelcome = async () => {
    setError(null); setNote(null);
    try {
      const res = await api.post('/api/v1/tasks/send-welcome-email', { email });
      setNote(res.data.message);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send');
    }
  };

  return (
    <Box maxWidth={560} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Admin Tools</Typography>
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
