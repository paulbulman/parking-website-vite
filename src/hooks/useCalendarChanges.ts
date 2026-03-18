import { useState } from "react";

export function useCalendarChanges<T>(
  initialValues: Record<string, T>,
) {
  const [changes, setChanges] = useState<Record<string, T>>({});

  const merged: Record<string, T> = { ...initialValues, ...changes };

  const update = (localDate: string, value: T) => {
    setChanges((prev) => ({ ...prev, [localDate]: value }));
  };

  const reset = () => setChanges({});

  return { merged, changes, update, reset };
}
