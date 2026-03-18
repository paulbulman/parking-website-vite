import type { ReactNode } from "react";

type AlertVariant = "success" | "error";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  success: "color-success",
  error: "color-danger",
};

export function Alert({ variant, children, className = "" }: AlertProps) {
  return (
    <div className={`${variantClasses[variant]} rounded-md px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

