import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';

const schema = z.object({
  username: z.string().min(1, 'Username or Email is required').optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(6, 'Password is required'),
}).refine((data) => !!data.username || !!data.email, { message: 'Provide username or email', path: ['username'] });

export function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [error, setError] = useState(null);

  const onSubmit = async (values) => {
    setError(null);
    try {
      await login(values);
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Box maxWidth={440} width="100%" className="fade-in">
        <Stack alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700}>Sign in</Typography>
          <Typography variant="body2" className="text-muted">Welcome back to TaskMaster</Typography>
        </Stack>
        <Card className="shadow-md">
          <CardContent>
            <Stack gap={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Username" {...register('username')} error={!!errors.username} helperText={errors.username?.message} fullWidth />
              <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} fullWidth />
              <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} fullWidth />
              <Button size="large" variant="contained" onClick={handleSubmit(onSubmit)}>Continue</Button>
              <Typography variant="body2" textAlign="center">No account? <a href="/register">Create one</a></Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
