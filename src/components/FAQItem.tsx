import type { ReactNode } from "react";

interface FAQItemProps {
  question: string;
  children: ReactNode;
}

function FAQItem({ question, children }: FAQItemProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-3">{question}</h2>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

export default FAQItem;
