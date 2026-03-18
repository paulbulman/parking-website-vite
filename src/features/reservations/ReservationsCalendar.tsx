import { useState } from "react";
import { Select, WeekCalendar } from "../../components/ui";
import { formatDate } from "../../utils/formatDate";

interface User {
  userId: string;
  name: string;
}

interface CalendarDay {
  localDate: string;
  hidden: boolean;
  data?: unknown;
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
  const { dayOfMonth, dayOfWeekShort, monthName } = formatDate(localDate);

  return (
    <>
      <div className={dayOfWeekClassName}>{dayOfWeekShort}</div>
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
  const { fullLabel: dateLabel } = formatDate(localDate);

  return (
    <div className="space-y-2">
      {Array.from({ length: shortLeadTimeSpaces }).map((_, index) => (
        <Select
          key={index}
          value={currentSelections[index] || ""}
          onChange={(e) => onSelectionChange(localDate, index, e.target.value)}
          aria-label={`Reservation slot ${index + 1} for ${dateLabel}`}
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
  calendarData: { weeks: { days: CalendarDay[] }[] };
  users: User[];
  shortLeadTimeSpaces: number;
  selections: Record<string, string[]>;
  onSelectionChange: (localDate: string, index: number, userId: string) => void;
  onWeekChange?: (weekIndex: number) => void;
  initialWeekIndex?: number;
}

export function ReservationsCalendar({
  calendarData,
  users,
  shortLeadTimeSpaces,
  selections,
  onSelectionChange,
  onWeekChange,
  initialWeekIndex = 0,
}: ReservationsCalendarProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  const handleWeekChange = (newIndex: number) => {
    setCurrentWeekIndex(newIndex);
    onWeekChange?.(newIndex);
  };

  return (
    <WeekCalendar
      weeks={calendarData.weeks}
      currentWeekIndex={currentWeekIndex}
      onWeekChange={handleWeekChange}
      className="mb-6"
      desktopCellClassName="p-4 text-center bg-[var(--color-surface)] align-top"
      renderMobileDay={(day) => {
        const currentSelections = selections[day.localDate] || [];

        return (
          <div className="card p-4">
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
      }}
      renderDesktopCell={(day) => {
        const currentSelections = selections[day.localDate] || [];

        return (
          <>
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
          </>
        );
      }}
    />
  );
}
