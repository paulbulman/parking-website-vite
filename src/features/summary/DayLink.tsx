import { Link } from "react-router-dom";
import { getStatusClasses, getStatusLabel } from "./helpers";
import { formatDate } from "../../utils/formatDate";

interface DayData {
  localDate: string;
  hidden: boolean;
  data?: {
    status?: string | null;
    isProblem?: boolean;
  } | null;
}

interface DayLinkProps {
  day: DayData;
  variant: "mobile" | "desktop";
}

export function DayLink({ day, variant }: DayLinkProps) {
  const { dayOfMonth, dayOfWeek, dayOfWeekShort, monthName } = formatDate(
    day.localDate
  );
  const statusClasses = getStatusClasses(day.data?.status);
  const status = getStatusLabel(day.data?.status);
  const isProblem = day.data?.isProblem;

  const accessibleName = `${dayOfWeek} ${dayOfMonth} ${monthName}, ${status.accessible}`;

  if (variant === "mobile") {
    return (
      <Link
        to={`/daily-details/${day.localDate}`}
        aria-label={accessibleName}
        data-problem={isProblem || undefined}
      className={`block rounded-lg p-4 transition-all hover:scale-[1.01] hover:shadow-md ${statusClasses} ${
          isProblem ? "ring-2 ring-[var(--color-danger)] ring-inset" : ""
        }`}
      >
        <div className="text-sm opacity-75 mb-1" aria-hidden="true">
          {dayOfWeekShort}
        </div>
        <time
          dateTime={day.localDate}
          className="block text-xl font-semibold mb-1"
          aria-hidden="true"
        >
          {dayOfMonth} {monthName}
        </time>
        <div className="text-sm font-medium" aria-hidden="true">
          {status.display}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/daily-details/${day.localDate}`}
      aria-label={accessibleName}
      data-problem={isProblem || undefined}
      className={`block p-4 text-center transition-all hover:brightness-95 h-full ${statusClasses} ${
        isProblem ? "ring-2 ring-[var(--color-danger)] ring-inset" : ""
      }`}
    >
      <div className="text-xs opacity-75 mb-1" aria-hidden="true">
        {dayOfWeekShort}
      </div>
      <time
        dateTime={day.localDate}
        className="block text-lg font-semibold mb-1"
        aria-hidden="true"
      >
        {dayOfMonth} {monthName}
      </time>
      <div className="text-sm font-medium" aria-hidden="true">
        {status.display}
      </div>
    </Link>
  );
}
