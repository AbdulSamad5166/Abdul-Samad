import React from 'react';
import { ChevronDownIcon } from '../icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, id, className = '', ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-slate-100 ${
              error
                ? 'border-rose-400 focus:ring-rose-500 dark:border-rose-600'
                : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
            } ${className}`}
            aria-invalid={!!error}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400 animate-fadeIn">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
