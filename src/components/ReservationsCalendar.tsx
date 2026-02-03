import { useState } from "react";
import { Button, Select } from "./ui";

interface User {
  userId: string;
  name: string;
}

interface CalendarData {
  weeks: Array<{
    days: Array<{
      localDate: string;
      hidden: boolean;
      data?: unknown;
    }>;
  }>;
}

interface DayHeaderProps {
  localDate: string;
  dayOfWeekClassName?: string;
  dateClassName?: string;
}

function DayHeader({
  localDate,
  dayOfWeekClassName = "",
  dateClassName = "",
}: DayHeaderProps) {
  const date = new Date(localDate);
  const dayOfMonth = date.getDate();
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });
  const monthName = date.toLocaleDateString("en-GB", { month: "short" });

  return (
    <>
      <div className={dayOfWeekClassName}>{dayOfWeek}</div>
      <div className={dateClassName}>
        {dayOfMonth} {monthName}
      </div>
    </>
  );
}

interface ReservationDropdownsProps {
  localDate: string;
  users: User[];
  shortLeadTimeSpaces: number;
  currentSelections: string[];
  onSelectionChange: (localDate: string, index: number, userId: string) => void;
}

function ReservationDropdowns({
  localDate,
  users,
  shortLeadTimeSpaces,
  currentSelections,
  onSelectionChange,
}: ReservationDropdownsProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: shortLeadTimeSpaces }).map((_, index) => (
        <Select
          key={index}
          value={currentSelections[index] || ""}
          onChange={(e) => onSelectionChange(localDate, index, e.target.value)}
        >
          <option value="">None</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </Select>
      ))}
    </div>
  );
}

interface ReservationsCalendarProps {
  calendarData: CalendarData;
  users: User[];
  shortLeadTimeSpaces: number;
  selections: Record<string, string[]>;
  onSelectionChange: (localDate: string, index: number, userId: string) => void;
  onWeekChange?: (weekIndex: number) => void;
  initialWeekIndex?: number;
}

function ReservationsCalendar({
  calendarData,
  users,
  shortLeadTimeSpaces,
  selections,
  onSelectionChange,
  onWeekChange,
  initialWeekIndex = 0,
}: ReservationsCalendarProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  const weeks = calendarData.weeks;
  const currentWeek = weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < weeks.length - 1;

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

        <div className="space-y-4">
          {currentWeek?.days.map((day, dayIndex) => {
            if (day.hidden) return null;

            const currentSelections = selections[day.localDate] || [];

            return (
              <div key={dayIndex} className="card p-4">
                <DayHeader
                  localDate={day.localDate}
                  dayOfWeekClassName="text-sm text-[var(--color-text-secondary)] mb-1"
                  dateClassName="text-xl font-semibold mb-3 text-[var(--color-text)]"
                />

                <ReservationDropdowns
                  localDate={day.localDate}
                  users={users}
                  shortLeadTimeSpaces={shortLeadTimeSpaces}
                  currentSelections={currentSelections}
                  onSelectionChange={onSelectionChange}
                />
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

                    const currentSelections = selections[day.localDate] || [];

                    return (
                      <td
                        key={dayIndex}
                        className="border-r border-b border-[var(--color-border)] last:border-r-0 p-4 text-center bg-[var(--color-surface)] align-top"
                      >
                        <DayHeader
                          localDate={day.localDate}
                          dayOfWeekClassName="text-xs text-[var(--color-text-secondary)] mb-1"
                          dateClassName="text-lg font-semibold mb-3 text-[var(--color-text)]"
                        />

                        <ReservationDropdowns
                          localDate={day.localDate}
                          users={users}
                          shortLeadTimeSpaces={shortLeadTimeSpaces}
                          currentSelections={currentSelections}
                          onSelectionChange={onSelectionChange}
                        />
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

export default ReservationsCalendar;
