import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';
  
  const variantStyles = {
    primary: cn(
      'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50',
      'hover:shadow-xl hover:shadow-primary-500/60 hover:scale-105 hover:-translate-y-0.5',
      'focus:ring-primary-500',
      'active:scale-100'
    ),
    secondary: cn(
      'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700',
      'hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 hover:-translate-y-0.5',
      'focus:ring-gray-500'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50',
      'hover:shadow-xl hover:shadow-red-500/60 hover:scale-105 hover:-translate-y-0.5',
      'focus:ring-red-500'
    ),
    success: cn(
      'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50',
      'hover:shadow-xl hover:shadow-green-500/60 hover:scale-105 hover:-translate-y-0.5',
      'focus:ring-green-500'
    ),
    ghost: cn(
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105',
      'focus:ring-gray-500'
    ),
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect on hover */}
      {variant !== 'ghost' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      )}
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="transition-transform group-hover:scale-110">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span className="transition-transform group-hover:scale-110">{rightIcon}</span>}
      </span>
    </button>
  );
};
