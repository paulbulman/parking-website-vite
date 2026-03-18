import type { ReactNode } from "react";
import PageHeader from "./PageHeader";

interface QueryPageProps<T> {
  title: string;
  action?: ReactNode;
  query: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  children: (data: T) => ReactNode;
}

function QueryPage<T>({ title, action, query, children }: QueryPageProps<T>) {
  return (
    <div>
      <PageHeader title={title} action={action} />
      {query.isLoading ? (
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      ) : query.error || !query.data ? (
        <p className="text-[var(--color-danger)]">
          Error: {query.error?.message ?? "No data available"}
        </p>
      ) : (
        children(query.data)
      )}
    </div>
  );
}

export default QueryPage;
