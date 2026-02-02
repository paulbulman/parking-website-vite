import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

function Select({ label, id, className = "", children, ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
        >
          {label}
        </label>
      )}
      <select id={id} className={`input-base ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

export default Select;
