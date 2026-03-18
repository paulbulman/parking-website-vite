export const getStatusClasses = (status: string | null | undefined) => {
  switch (status) {
    case "allocated":
      return "status-allocated";
    case "pending":
      return "status-pending";
    case "interrupted":
    case "hardInterrupted":
      return "status-interrupted";
    default:
      return "bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]";
  }
};

export const getStatusLabel = (status: string | null | undefined) => {
  switch (status) {
    case "allocated":
      return { display: "Allocated", accessible: "Allocated" };
    case "pending":
      return { display: "Pending", accessible: "Pending" };
    case "interrupted":
    case "hardInterrupted":
      return { display: "Interrupted", accessible: "Interrupted" };
    default:
      return { display: "-", accessible: "No status" };
  }
};

export const formatDate = (localDate: string) => {
  const date = new Date(localDate);
  return {
    dayOfMonth: date.getDate(),
    dayOfWeek: date.toLocaleDateString("en-GB", { weekday: "long" }),
    dayOfWeekShort: date.toLocaleDateString("en-GB", { weekday: "short" }),
    monthName: date.toLocaleDateString("en-GB", { month: "short" }),
  };
};
