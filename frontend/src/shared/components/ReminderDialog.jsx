import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material';

export function ReminderDialog({ open, onClose, onSchedule, defaultTime }) {
  const [reminderTime, setReminderTime] = useState(defaultTime || '');

  const handleSchedule = async () => {
    if (!reminderTime) return;
    await onSchedule(reminderTime);
    onClose();
    setReminderTime('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Schedule Reminder</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField
            type="datetime-local"
            label="Reminder time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSchedule} disabled={!reminderTime}>Schedule</Button>
      </DialogActions>
    </Dialog>
  );
}
