import { useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, Paper, Stack, TextField, Typography, Fade, CircularProgress
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../../shared/api/client';
import dayjs from 'dayjs';

export function NLPPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);

  const handleParse = async () => {
    if (!input.trim()) {
      setError('Please enter some text to parse');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/api/v1/tasks/nlp/parse', { text: input });
      setResult(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to parse text');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!result) return;

    try {
      await api.post('/api/v1/tasks', {
        title: result.title,
        description: result.description,
        deadline: result.deadline,
        priority: result.priority,
        category: result.category,
        time_required: result.time_required,
        natural_language_input: input,
      });
      setSuccess('Task created successfully!');
      setInput('');
      setResult(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create task');
      setTimeout(() => setError(null), 5000);
    }
  };

  const examples = [
    'Finish project report by Friday at 5pm, high priority',
    'Call dentist tomorrow at 2pm for appointment',
    'Review code changes before Monday morning meeting',
    'Buy groceries this weekend, low priority, takes about 60 minutes',
  ];

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          NLP Task Parser
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Describe your task naturally - our AI will extract title, deadline, priority, and more!
        </Typography>
      </Box>

      {/* Input Card */}
      <Card elevation={3}>
        <CardContent>
          <Stack gap={2.5}>
            <TextField
              label="Describe your task naturally"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              multiline
              rows={4}
              placeholder="e.g., Finish the quarterly report by next Friday at 5pm, high priority, should take about 2 hours"
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SmartToyIcon />}
              onClick={handleParse}
              disabled={loading || !input.trim()}
              sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
            >
              {loading ? 'Parsing...' : 'Parse with AI'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Example Inputs
          </Typography>
          <Stack gap={1}>
            {examples.map((example, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                }}
                onClick={() => setInput(example)}
              >
                <Typography variant="body2" color="text.secondary">
                  "{example}"
                </Typography>
              </Paper>
            ))}
          </Stack>
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
              <Stack gap={2.5}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartToyIcon color="primary" /> Parsed Results
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Title</Typography>
                      <Typography variant="h6" fontWeight={600}>{result.title || 'N/A'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
                      <Typography>{result.description || 'N/A'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Priority</Typography>
                      <Chip
                        label={result.priority || 'medium'}
                        color={
                          result.priority === 'urgent' ? 'error' :
                          result.priority === 'high' ? 'warning' :
                          result.priority === 'low' ? 'default' : 'info'
                        }
                        sx={{ fontWeight: 600, mt: 0.5 }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Category</Typography>
                      <Chip label={result.category || 'general'} variant="outlined" sx={{ mt: 0.5 }} />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Deadline</Typography>
                      <Typography fontWeight={500}>
                        {result.deadline ? dayjs(result.deadline).format('MMM DD, YYYY HH:mm') : 'Not specified'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Time Required</Typography>
                      <Typography fontWeight={500}>
                        {result.time_required ? `${result.time_required} minutes` : 'Not specified'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {result.suggestions && result.suggestions.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                      Suggested Time Slots
                    </Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {result.suggestions.map((slot, idx) => (
                        <Chip
                          key={idx}
                          label={dayjs(slot).format('MMM DD, HH:mm')}
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateTask}
                  sx={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
                >
                  Create Task with These Details
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Stack>
  );
}
