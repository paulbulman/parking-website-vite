import { useState } from "react";

interface CalendarData {
  weeks: Array<{
    days: Array<{
      localDate: string;
      hidden: boolean;
      data?: unknown;
    }>;
  }>;
}

interface RequestsCalendarProps {
  calendarData: CalendarData;
  requests: Record<string, boolean>;
  onCheckboxChange?: (localDate: string) => void;
  onWeekChange?: (weekIndex: number) => void;
  initialWeekIndex?: number;
  readOnly?: boolean;
}

function RequestsCalendar({
  calendarData,
  requests,
  onCheckboxChange,
  onWeekChange,
  initialWeekIndex = 0,
  readOnly = false,
}: RequestsCalendarProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  const weeks = calendarData.weeks;
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
    <div className="mb-6">
      {/* Mobile view - single column with week navigation */}
      <div className="block md:hidden">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              const newIndex = Math.max(0, currentWeekIndex - 1);
              setCurrentWeekIndex(newIndex);
              onWeekChange?.(newIndex);
            }}
            disabled={!hasPreviousWeek}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous week
          </button>
          <button
            onClick={() => {
              const newIndex = Math.min(weeks.length - 1, currentWeekIndex + 1);
              setCurrentWeekIndex(newIndex);
              onWeekChange?.(newIndex);
            }}
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
            const isChecked = requests[day.localDate] || false;

            return (
              <div
                key={dayIndex}
                onClick={() =>
                  !readOnly && onCheckboxChange?.(day.localDate)
                }
                className={`rounded p-4 bg-white border border-gray-300 hover:bg-gray-50 ${
                  !readOnly ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">{dayOfWeek}</div>
                    <div className="text-xl font-semibold">
                      {dayOfMonth} {monthName}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    disabled={readOnly}
                    className="w-6 h-6 pointer-events-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view - table with all weeks */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.days.map((day, dayIndex) => {
                  if (day.hidden) {
                    return (
                      <td
                        key={dayIndex}
                        className="border border-gray-300 p-0"
                      ></td>
                    );
                  }

                  const { dayOfMonth, dayOfWeek, monthName } = formatDate(
                    day.localDate
                  );
                  const isChecked = requests[day.localDate] || false;

                  return (
                    <td
                      key={dayIndex}
                      onClick={() =>
                        !readOnly && onCheckboxChange?.(day.localDate)
                      }
                      className={`border border-gray-300 p-4 text-center bg-white hover:bg-gray-50 ${
                        !readOnly ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        {dayOfMonth} {monthName}
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          disabled={readOnly}
                          className="w-5 h-5 pointer-events-none"
                        />
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

export default RequestsCalendar;
