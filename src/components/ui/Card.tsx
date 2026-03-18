import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, className = "", elevated = false }: CardProps) {
  return (
    <div className={`${elevated ? "card-elevated" : "card"} p-6 ${className}`}>
      {children}
    </div>
  );
}

