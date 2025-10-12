import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import { Alert, Box, Card, CardContent, Chip, Stack, Typography, Button } from '@mui/material';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import { ReminderDialog } from '../../../shared/components/ReminderDialog';
import dayjs from 'dayjs';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [reminderOpen, setReminderOpen] = useState(false);

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
    <Box>
      <Card>
        <CardContent>
          <Stack gap={1}>
            <Typography variant="h5" fontWeight={700}>{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Stack direction="row" gap={1}>
              <Chip label={`Priority: ${task.priority}`} />
              <Chip label={`Status: ${task.status}`} />
              <Chip label={`Category: ${task.category}`} />
              <Chip label={`Deadline: ${task.deadline ? dayjs(task.deadline).format('YYYY-MM-DD HH:mm') : '-'}`} />
            </Stack>
            <Stack direction="row" gap={1} mt={1}>
              <Button size="small" variant="outlined" startIcon={<AlarmAddIcon />} onClick={() => setReminderOpen(true)}>Schedule reminder</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <ReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        onSchedule={async (time) => { await api.post(`/api/v1/tasks/${taskId}/reminder`, { reminderTime: time }); setReminderOpen(false); }}
        defaultTime={task.deadline ? dayjs(task.deadline).format('YYYY-MM-DDTHH:mm') : ''}
      />
    </Box>
  );
}
