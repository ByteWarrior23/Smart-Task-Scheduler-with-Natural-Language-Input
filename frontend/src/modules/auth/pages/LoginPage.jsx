import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography, Link, Paper } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

const schema = z.object({
  username: z.string().min(1, 'Username or Email is required').optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(6, 'Password is required'),
}).refine((data) => !!data.username || !!data.email, { message: 'Provide username or email', path: ['username'] });

export function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setError(null);
    setLoading(true);
    try {
      await login(values);
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card
        elevation={10}
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={800} gutterBottom>
            TaskMaster
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Your Smart Task Management Solution
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Stack gap={3}>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your dashboard
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <TextField
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
            />

            <TextField
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                  Create one now
                </Link>
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
