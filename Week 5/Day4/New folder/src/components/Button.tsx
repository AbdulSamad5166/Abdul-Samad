import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function Button({ isLoading = false, loadingText, disabled, children, ...buttonProps }: ButtonProps) {
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "submit"}
      disabled={disabled || isLoading}
      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
