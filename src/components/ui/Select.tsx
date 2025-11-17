import React, { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <select
          ref={ref}
          className={`form-select ${error ? 'border-[var(--danger)]' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
