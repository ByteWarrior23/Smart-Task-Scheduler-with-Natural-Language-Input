import { useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, Paper, Stack, Typography, Fade, CircularProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import TranscribeIcon from '@mui/icons-material/Subtitles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { api } from '../../../shared/api/client';

export function VoicePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('');

  const upload = async (endpoint, modeName) => {
    if (!file) {
      setError('Please select an audio file first');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setMode(modeName);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
      if (modeName === 'create') {
        setSuccess('Task created successfully from voice input!');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Upload failed');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Voice Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create tasks using your voice - simply upload an audio file and let AI do the rest
        </Typography>
      </Box>

      {/* Upload Card */}
      <Card elevation={3}>
        <CardContent>
          <Stack gap={3}>
            <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
              <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upload Audio File
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supported formats: MP3, WAV, M4A, OGG
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
              >
                Choose File
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {file && (
                <Chip
                  label={file.name}
                  onDelete={() => setFile(null)}
                  sx={{ mt: 2 }}
                  color="primary"
                />
              )}
            </Box>

            {file && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={loading && mode === 'transcribe' ? <CircularProgress size={20} /> : <TranscribeIcon />}
                    onClick={() => upload('/api/v1/voice/transcribe', 'transcribe')}
                    disabled={loading}
                    sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  >
                    Transcribe Only
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={loading && mode === 'parse' ? <CircularProgress size={20} /> : <SmartToyIcon />}
                    onClick={() => upload('/api/v1/voice/parse', 'parse')}
                    disabled={loading}
                    sx={{ py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  >
                    Parse Task Data
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={loading && mode === 'create' ? <CircularProgress size={20} /> : <AddTaskIcon />}
                    onClick={() => upload('/api/v1/voice/create-task', 'create')}
                    disabled={loading}
                    sx={{ py: 1.5, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
                  >
                    Create Task
                  </Button>
                </Grid>
              </Grid>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MicIcon /> How It Works
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, textAlign: 'center', height: '100%', bgcolor: 'background.default' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, fontSize: '1.5rem' }}>
                  1
                </Box>
                <Typography variant="body1" fontWeight={600} gutterBottom>Transcribe</Typography>
                <Typography variant="body2" color="text.secondary">
                  Convert your audio to text using advanced speech recognition
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, textAlign: 'center', height: '100%', bgcolor: 'background.default' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'secondary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, fontSize: '1.5rem' }}>
                  2
                </Box>
                <Typography variant="body1" fontWeight={600} gutterBottom>Parse</Typography>
                <Typography variant="body2" color="text.secondary">
                  Extract task details like title, deadline, and priority using NLP
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, textAlign: 'center', height: '100%', bgcolor: 'background.default' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'success.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, fontSize: '1.5rem' }}>
                  3
                </Box>
                <Typography variant="body1" fontWeight={600} gutterBottom>Create</Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatically create a task with all extracted information
                </Typography>
              </Paper>
            </Grid>
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

      {/* Results */}
      {result && (
        <Fade in>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {mode === 'transcribe' && <><TranscribeIcon /> Transcription Result</>}
                {mode === 'parse' && <><SmartToyIcon /> Parsed Task Data</>}
                {mode === 'create' && <><AddTaskIcon /> Task Created Successfully</>}
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  mt: 2,
                  bgcolor: '#0f172a',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  maxHeight: 400,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#1e293b',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#10b981',
                    borderRadius: '4px',
                  },
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Tips */}
      <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            💡 Tips for Best Results
          </Typography>
          <Stack component="ul" sx={{ m: 0, pl: 2.5 }} gap={0.5}>
            <Typography component="li" variant="body2">
              Speak clearly and at a moderate pace
            </Typography>
            <Typography component="li" variant="body2">
              Include specific details like dates, times, and priorities
            </Typography>
            <Typography component="li" variant="body2">
              Use natural language: "Finish the report by Friday at 5pm, high priority"
            </Typography>
            <Typography component="li" variant="body2">
              Keep audio files under 10MB for faster processing
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
