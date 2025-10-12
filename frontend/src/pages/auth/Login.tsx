import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { EnvelopeIcon, LockClosedIcon, SparklesIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

  const features = [
    { icon: CheckCircleIcon, text: 'Natural Language Task Creation' },
    { icon: BoltIcon, text: 'Smart Scheduling & Conflicts' },
    { icon: SparklesIcon, text: 'Voice-Powered Input' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden md:block space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur-xl opacity-60"></div>
                  <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-4 rounded-2xl">
                    <SparklesIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your intelligent task management companion
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="space-y-6 animate-scale-in">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8 md:hidden">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur-xl opacity-60"></div>
                    <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-3 rounded-2xl">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back!</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Sign in to continue managing your tasks
                </p>
              </div>

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
                    placeholder="Enter your username"
                    leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setUseEmail(!useEmail)}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {useEmail ? '← Use username instead' : '→ Use email instead'}
                </button>

                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Enter your password"
                  leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                />

                <Button type="submit" fullWidth loading={loading} size="lg">
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Create one now →
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
