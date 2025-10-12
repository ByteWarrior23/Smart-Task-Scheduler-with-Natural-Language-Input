import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-500 mb-2">
            TaskFlow
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {useEmail ? (
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="you@example.com"
                leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              />
            ) : (
              <Input
                label="Username"
                type="text"
                {...register('username')}
                error={errors.username?.message}
                placeholder="username"
                leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              />
            )}

            <button
              type="button"
              onClick={() => setUseEmail(!useEmail)}
              className="text-sm text-primary-600 dark:text-primary-500 hover:underline"
            >
              {useEmail ? 'Use username instead' : 'Use email instead'}
            </button>

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
              leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
