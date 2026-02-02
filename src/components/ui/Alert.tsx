import type { ReactNode } from "react";

type AlertVariant = "success" | "error" | "info";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  success: "status-allocated",
  error: "status-interrupted",
  info: "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary)]/20",
};

function Alert({ variant, children, className = "" }: AlertProps) {
  return (
    <div className={`${variantClasses[variant]} rounded-md px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

export default Alert;
