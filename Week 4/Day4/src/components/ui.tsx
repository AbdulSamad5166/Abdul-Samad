
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    ghost: "text-slate-400 hover:bg-slate-800 hover:text-white",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900 p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-amber-500/10 text-amber-400",
    danger: "bg-red-500/10 text-red-400",
    neutral: "bg-slate-700/60 text-slate-300",
    info: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
        {...props}
      />
    </div>
  );
}

export function Dropdown({
  label,
  options,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  const selectId = id ?? props.name;

  return (
    <div className="grid gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <select
        id={selectId}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Alert({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-300"
    >
      <div>{children}</div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onClose}
          className="rounded p-1 text-blue-300 hover:bg-blue-500/20"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="my-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
