import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <textarea
          ref={ref}
          className={`form-textarea ${error ? 'border-[var(--danger)]' : ''} ${className}`}
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

Textarea.displayName = 'Textarea';
