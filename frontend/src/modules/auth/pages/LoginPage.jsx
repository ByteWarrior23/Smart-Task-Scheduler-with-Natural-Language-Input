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
    <Box maxWidth={420} mx="auto" mt={8}>
      <Card>
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h5" fontWeight={700}>Welcome back</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Username" {...register('username')} error={!!errors.username} helperText={errors.username?.message} />
            <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>Login</Button>
            <Typography variant="body2">No account? <a href="/register">Register</a></Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
