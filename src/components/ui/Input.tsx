import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <input
          ref={ref}
          className={`form-input ${error ? 'border-[var(--danger)]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
