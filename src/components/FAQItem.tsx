import type { ReactNode } from "react";

interface FAQItemProps {
  question: string;
  children: ReactNode;
}

function FAQItem({ question, children }: FAQItemProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
        {question}
      </h2>
      <div className="text-[var(--color-text-secondary)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default FAQItem;
