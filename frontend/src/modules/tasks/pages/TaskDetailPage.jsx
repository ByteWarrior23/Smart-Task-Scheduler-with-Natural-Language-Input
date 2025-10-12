import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import { Alert, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/v1/tasks/${taskId}`);
        setTask(res.data.data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load task');
      }
    })();
  }, [taskId]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!task) return null;

  return (
    <Box className="fade-in">
      <Card className="shadow-sm">
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h4" fontWeight={700}>{task.title}</Typography>
            <Typography className="text-muted">{task.description}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip size="small" color={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'} label={`Priority: ${task.priority}`} />
              <Chip size="small" color={task.status === 'completed' ? 'success' : 'default'} label={`Status: ${task.status}`} />
              <Chip size="small" label={`Category: ${task.category}`} />
              <Chip size="small" label={`Deadline: ${task.deadline ? dayjs(task.deadline).format('YYYY-MM-DD HH:mm') : '-'}`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
