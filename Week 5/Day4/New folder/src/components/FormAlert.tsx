import type { ReactNode } from "react";

interface FormAlertProps {
  variant: "error" | "success";
  children: ReactNode;
}

export function FormAlert({ variant, children }: FormAlertProps) {
  const styles =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
