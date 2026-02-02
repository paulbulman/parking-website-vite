import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";
import { Button, PageHeader } from "../components/ui";

interface DayData {
  localDate: string;
  hidden: boolean;
  data?: {
    status?: string | null;
    isProblem?: boolean;
  } | null;
}

const getStatusClasses = (status: string | null | undefined) => {
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

const getStatusLabel = (status: string | null | undefined) => {
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

const formatDate = (localDate: string) => {
  const date = new Date(localDate);
  return {
    dayOfMonth: date.getDate(),
    dayOfWeek: date.toLocaleDateString("en-GB", { weekday: "long" }),
    dayOfWeekShort: date.toLocaleDateString("en-GB", { weekday: "short" }),
    monthName: date.toLocaleDateString("en-GB", { month: "short" }),
  };
};

interface DayLinkProps {
  day: DayData;
  variant: "mobile" | "desktop";
}

function DayLink({ day, variant }: DayLinkProps) {
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

function Home() {
  const [searchParams] = useSearchParams();
  const { data, isLoading, error } = useSummary();

  const initialWeekIndex = parseInt(searchParams.get("week") ?? "0", 10) || 0;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Summary" />
        <p className="text-[var(--color-text-secondary)]">Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Summary" />
        <p className="text-[var(--color-danger)]">
          Error loading summary data: {error.message}
        </p>
      </div>
    );
  }

  const weeks = data?.summary.weeks ?? [];
  const currentWeek = weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < weeks.length - 1;

  return (
    <div>
      <PageHeader
        title="Summary"
        action={
          <Link to={`/edit-requests?week=${currentWeekIndex}`}>
            <Button>Edit Requests</Button>
          </Link>
        }
      />

      {/* Mobile view - single column with week navigation */}
      <nav className="block md:hidden" aria-label="Weekly summary">
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
            disabled={!hasPreviousWeek}
          >
            Previous week
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentWeekIndex((prev) =>
                Math.min(weeks.length - 1, prev + 1)
              )
            }
            disabled={!hasNextWeek}
          >
            Next week
          </Button>
        </div>

        <ul className="space-y-3">
          {currentWeek?.days.map((day) => {
            if (day.hidden) return null;
            return (
              <li key={day.localDate}>
                <DayLink day={day} variant="mobile" />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop view - table with all weeks */}
      <nav className="hidden md:block overflow-x-auto" aria-label="Weekly summary">
        <div className="card overflow-hidden">
          <table className="min-w-full table-fixed">
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.days.map((day, dayIndex) => {
                    if (day.hidden) {
                      return (
                        <td
                          key={dayIndex}
                          className="border-r border-b border-[var(--color-border)] last:border-r-0 p-0 w-1/5"
                        ></td>
                      );
                    }

                    return (
                      <td
                        key={day.localDate}
                        className="border-r border-b border-[var(--color-border)] last:border-r-0 p-0 w-1/5"
                      >
                        <DayLink day={day} variant="desktop" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </nav>
    </div>
  );
}

export default Home;
