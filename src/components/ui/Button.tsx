import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400 border border-gray-200',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus:ring-gray-400',
    destructive: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 focus:ring-danger-500 shadow-soft hover:shadow-medium',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-9',
    lg: 'px-6 py-2.5 text-base h-11',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {Icon && !loading && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </button>
  );
};