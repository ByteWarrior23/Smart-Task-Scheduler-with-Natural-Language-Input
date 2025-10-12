import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  fullname: z.string().min(1),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormData) => {
    setError(null);
    try {
      await registerUser(values);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box maxWidth={420} mx="auto" mt={8}>
      <Card>
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h5" fontWeight={700}>Create your account</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Username" {...register('username')} error={!!errors.username} helperText={errors.username?.message} />
            <TextField label="Full name" {...register('fullname')} error={!!errors.fullname} helperText={errors.fullname?.message} />
            <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>Register</Button>
            <Typography variant="body2">Have an account? <a href="/login">Login</a></Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
