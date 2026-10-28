import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className = '', rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            error
              ? 'border-rose-400 focus:ring-rose-500 dark:border-rose-600'
              : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
