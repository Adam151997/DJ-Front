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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-200 shadow-sm hover:shadow-md',
    secondary: 'bg-theme-bg-tertiary text-theme-text-primary hover:bg-theme-bg-secondary active:bg-theme-bg-tertiary focus:ring-primary-200 border border-theme-border-primary hover:border-theme-border-secondary',
    outline: 'border border-theme-border-primary bg-theme-bg-primary text-theme-text-primary hover:bg-theme-bg-tertiary hover:border-theme-border-secondary active:bg-theme-bg-secondary focus:ring-primary-200 shadow-xs',
    ghost: 'text-theme-text-secondary hover:bg-theme-bg-tertiary hover:text-theme-text-primary active:bg-theme-bg-secondary focus:ring-primary-200',
    destructive: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus:ring-danger-200 shadow-sm hover:shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8 gap-1.5',
    md: 'px-4 py-2 text-sm h-9 gap-2',
    lg: 'px-5 py-2.5 text-base h-10 gap-2',
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