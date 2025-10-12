import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/PageHeader';

export function NotFoundPage() {
  return (
    <Box py={6}>
      <PageHeader title="404" subtitle="Page not found" />
      <Box textAlign="center">
        <Button variant="contained" component={RouterLink} to="/tasks">Go Home</Button>
      </Box>
    </Box>
  );
}
