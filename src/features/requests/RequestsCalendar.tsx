import { useState } from "react";
import { WeekCalendar } from "../../components/ui";
import { formatDate } from "../../utils/formatDate";

interface CalendarDay {
  localDate: string;
  hidden: boolean;
  data?: unknown;
}

interface RequestsCalendarProps {
  calendarData: { weeks: { days: CalendarDay[] }[] };
  requests: Record<string, boolean>;
  onCheckboxChange?: (localDate: string) => void;
  onWeekChange?: (weekIndex: number) => void;
  initialWeekIndex?: number;
  readOnly?: boolean;
}

function MobileCheckboxDay({
  day,
  isChecked,
  readOnly,
  onCheckboxChange,
}: {
  day: CalendarDay;
  isChecked: boolean;
  readOnly: boolean;
  onCheckboxChange?: (localDate: string) => void;
}) {
  const { dayOfMonth, dayOfWeekShort, monthName, fullLabel } = formatDate(
    day.localDate
  );

  return (
    <label
      className={`card p-4 transition-colors block ${
        !readOnly ? "cursor-pointer hover:bg-[var(--color-bg-subtle)]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[var(--color-text-secondary)] mb-1">
            {dayOfWeekShort}
          </div>
          <div className="text-xl font-semibold text-[var(--color-text)]">
            {dayOfMonth} {monthName}
          </div>
        </div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange?.(day.localDate)}
          disabled={readOnly}
          aria-label={`Request parking for ${fullLabel}`}
          className="w-6 h-6"
        />
      </div>
    </label>
  );
}

function DesktopCheckboxDay({
  day,
  isChecked,
  readOnly,
  onCheckboxChange,
}: {
  day: CalendarDay;
  isChecked: boolean;
  readOnly: boolean;
  onCheckboxChange?: (localDate: string) => void;
}) {
  const { dayOfMonth, dayOfWeekShort, monthName, fullLabel } = formatDate(
    day.localDate
  );

  return (
    <label className={!readOnly ? "cursor-pointer" : ""}>
      <div className="text-xs text-[var(--color-text-secondary)] mb-1">
        {dayOfWeekShort}
      </div>
      <div className="text-lg font-semibold text-[var(--color-text)] mb-2">
        {dayOfMonth} {monthName}
      </div>
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange?.(day.localDate)}
          disabled={readOnly}
          aria-label={`Request parking for ${fullLabel}`}
          className="w-5 h-5"
        />
      </div>
    </label>
  );
}

export function RequestsCalendar({
  calendarData,
  requests,
  onCheckboxChange,
  onWeekChange,
  initialWeekIndex = 0,
  readOnly = false,
}: RequestsCalendarProps) {
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
      desktopCellClassName={`p-4 text-center bg-[var(--color-surface)] transition-colors ${
        !readOnly ? "cursor-pointer hover:bg-[var(--color-bg-subtle)]" : ""
      }`}
      renderMobileDay={(day) => (
        <MobileCheckboxDay
          day={day}
          isChecked={requests[day.localDate] || false}
          readOnly={readOnly}
          onCheckboxChange={onCheckboxChange}
        />
      )}
      renderDesktopCell={(day) => (
        <DesktopCheckboxDay
          day={day}
          isChecked={requests[day.localDate] || false}
          readOnly={readOnly}
          onCheckboxChange={onCheckboxChange}
        />
      )}
    />
  );
}
