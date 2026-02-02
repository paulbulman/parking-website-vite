import { useState } from "react";
import { Button } from "./ui";

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
          <Button
            variant="secondary"
            onClick={() => {
              const newIndex = Math.max(0, currentWeekIndex - 1);
              setCurrentWeekIndex(newIndex);
              onWeekChange?.(newIndex);
            }}
            disabled={!hasPreviousWeek}
          >
            Previous week
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const newIndex = Math.min(weeks.length - 1, currentWeekIndex + 1);
              setCurrentWeekIndex(newIndex);
              onWeekChange?.(newIndex);
            }}
            disabled={!hasNextWeek}
          >
            Next week
          </Button>
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
                onClick={() => !readOnly && onCheckboxChange?.(day.localDate)}
                className={`card p-4 transition-colors ${
                  !readOnly
                    ? "cursor-pointer hover:bg-[var(--color-bg-subtle)]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                      {dayOfWeek}
                    </div>
                    <div className="text-xl font-semibold text-[var(--color-text)]">
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
        <div className="card overflow-hidden">
          <table className="min-w-full">
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.days.map((day, dayIndex) => {
                    if (day.hidden) {
                      return (
                        <td
                          key={dayIndex}
                          className="border-r border-b border-[var(--color-border)] last:border-r-0 p-0"
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
                        className={`border-r border-b border-[var(--color-border)] last:border-r-0 p-4 text-center bg-[var(--color-surface)] transition-colors ${
                          !readOnly
                            ? "cursor-pointer hover:bg-[var(--color-bg-subtle)]"
                            : ""
                        }`}
                      >
                        <div className="text-xs text-[var(--color-text-secondary)] mb-1">
                          {dayOfWeek}
                        </div>
                        <div className="text-lg font-semibold text-[var(--color-text)] mb-2">
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
    </div>
  );
}

export default RequestsCalendar;
