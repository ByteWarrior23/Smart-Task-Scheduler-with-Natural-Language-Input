import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { EnvelopeIcon, LockClosedIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    
    return { strength, label: labels[strength - 1] || '', color: colors[strength - 1] || '' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6 animate-scale-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-4 rounded-2xl">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join thousands of productive users today
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              {...register('fullname')}
              error={errors.fullname?.message}
              placeholder="John Doe"
              leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Username"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              placeholder="johndoe"
              leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
              helpText="3-16 characters, letters, numbers, and underscores only"
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="you@example.com"
              leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Create a strong password"
                leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Password strength:
                    </span>
                    <span className={`text-xs font-semibold ${passwordStrength.strength >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength.strength ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Confirm your password"
              leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Password requirements:</strong> Minimum 8 characters with at least one uppercase, lowercase, and number.
              </p>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline hover:text-primary-600">Terms</a> and{' '}
          <a href="#" className="underline hover:text-primary-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};
