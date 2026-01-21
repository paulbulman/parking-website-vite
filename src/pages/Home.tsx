import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";

interface DayData {
  localDate: string;
  hidden: boolean;
  data?: {
    status?: string | null;
    isProblem?: boolean;
  } | null;
}

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "allocated":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "interrupted":
    case "hardInterrupted":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-50 text-gray-400";
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
  const statusColor = getStatusColor(day.data?.status);
  const status = getStatusLabel(day.data?.status);
  const isProblem = day.data?.isProblem;

  const accessibleName = `${dayOfWeek} ${dayOfMonth} ${monthName}, ${status.accessible}`;

  if (variant === "mobile") {
    return (
      <Link
        to={`/daily-details/${day.localDate}`}
        aria-label={accessibleName}
        className={`block rounded p-4 hover:opacity-80 ${statusColor} ${
          isProblem ? "ring-2 ring-red-500 ring-inset" : ""
        }`}
      >
        <div className="text-sm text-gray-600 mb-1" aria-hidden="true">
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
      className={`block p-4 text-center hover:opacity-80 h-full ${statusColor} ${
        isProblem ? "ring-2 ring-red-500 ring-inset" : ""
      }`}
    >
      <div className="text-xs text-gray-600 mb-1" aria-hidden="true">
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
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p>Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p className="text-red-600">
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
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Summary</h1>

      <div className="mb-4">
        <Link
          to={`/edit-requests?week=${currentWeekIndex}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Requests
        </Link>
      </div>

      {/* Mobile view - single column with week navigation */}
      <nav className="block md:hidden" aria-label="Weekly summary">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
            disabled={!hasPreviousWeek}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous week
          </button>
          <button
            onClick={() =>
              setCurrentWeekIndex((prev) =>
                Math.min(weeks.length - 1, prev + 1)
              )
            }
            disabled={!hasNextWeek}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next week
          </button>
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
        <table className="min-w-full border-collapse border border-gray-300 table-fixed">
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.days.map((day, dayIndex) => {
                  if (day.hidden) {
                    return (
                      <td
                        key={dayIndex}
                        className="border border-gray-300 p-0 w-1/5"
                      ></td>
                    );
                  }

                  return (
                    <td
                      key={day.localDate}
                      className="border border-gray-300 p-0 w-1/5"
                    >
                      <DayLink day={day} variant="desktop" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </nav>
    </div>
  );
}

export default Home;
