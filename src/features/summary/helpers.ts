export const getStatusClasses = (status: string | null | undefined) => {
  switch (status) {
    case "allocated":
      return "color-success";
    case "pending":
      return "color-warning";
    case "interrupted":
    case "hardInterrupted":
      return "color-danger";
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
