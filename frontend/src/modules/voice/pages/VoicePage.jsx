import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageHeader } from '../../../shared/components/PageHeader';
import { api } from '../../../shared/api/client';

export function VoicePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const upload = async (endpoint) => {
    if (!file) return;
    setError(null); setResult(null);
    const formData = new FormData();
    formData.append('audio', file);
    try {
      const res = await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Box>
      <PageHeader title="Voice Assistant" subtitle="Transcribe, parse, and create tasks from audio" />
      <Card>
        <CardContent>
          <Stack gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <Button variant="outlined" onClick={() => upload('/api/v1/voice/transcribe')}>Transcribe</Button>
              <Button variant="outlined" onClick={() => upload('/api/v1/voice/parse')}>Parse</Button>
              <Button variant="contained" onClick={() => upload('/api/v1/voice/create-task')}>Create Task</Button>
            </Stack>
            {result && (
              <pre style={{ background: '#0b1020', color: '#90ee90', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
