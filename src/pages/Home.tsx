import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";

function Home() {
  const navigate = useNavigate();
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
        return "Allocated";
      case "pending":
        return "Pending";
      case "interrupted":
      case "hardInterrupted":
        return "Interrupted";
      default:
        return "-";
    }
  };

  const weeks = data?.summary.weeks ?? [];
  const currentWeek = weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < weeks.length - 1;

  const formatDate = (localDate: string) => {
    const date = new Date(localDate);
    return {
      dayOfMonth: date.getDate(),
      dayOfWeek: date.toLocaleDateString("en-GB", { weekday: "short" }),
      monthName: date.toLocaleDateString("en-GB", { month: "short" }),
    };
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Summary</h1>

      <div className="mb-4">
        <button
          onClick={() => navigate(`/edit-requests?week=${currentWeekIndex}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Requests
        </button>
      </div>

      {/* Mobile view - single column with week navigation */}
      <div className="block md:hidden">
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

        <div className="space-y-3">
          {currentWeek?.days.map((day, dayIndex) => {
            if (day.hidden) return null;

            const { dayOfMonth, dayOfWeek, monthName } = formatDate(
              day.localDate
            );
            const statusColor = getStatusColor(day.data?.status);
            const isProblem = day.data?.isProblem;

            return (
              <div
                key={dayIndex}
                onClick={() => navigate(`/daily-details/${day.localDate}`)}
                className={`rounded p-4 cursor-pointer hover:opacity-80 ${statusColor} ${
                  isProblem ? "ring-2 ring-red-500 ring-inset" : ""
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">{dayOfWeek}</div>
                <div className="text-xl font-semibold mb-1">
                  {dayOfMonth} {monthName}
                </div>
                <div className="text-sm font-medium">
                  {getStatusLabel(day.data?.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view - table with all weeks */}
      <div className="hidden md:block overflow-x-auto">
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

                  const { dayOfMonth, dayOfWeek, monthName } = formatDate(
                    day.localDate
                  );
                  const statusColor = getStatusColor(day.data?.status);
                  const isProblem = day.data?.isProblem;

                  return (
                    <td
                      key={dayIndex}
                      onClick={() =>
                        navigate(`/daily-details/${day.localDate}`)
                      }
                      className={`border border-gray-300 p-4 text-center cursor-pointer hover:opacity-80 w-1/5 ${statusColor} ${
                        isProblem ? "ring-2 ring-red-500 ring-inset" : ""
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-semibold mb-1">
                        {dayOfMonth} {monthName}
                      </div>
                      <div className="text-sm font-medium">
                        {getStatusLabel(day.data?.status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
