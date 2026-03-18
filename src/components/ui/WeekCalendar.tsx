import type { ReactNode } from "react";
import { WeekNavigation } from "./WeekNavigation";

interface WeekCalendarDay {
  localDate: string;
  hidden: boolean;
}

interface WeekCalendarProps<TDay extends WeekCalendarDay> {
  weeks: { days: TDay[] }[];
  currentWeekIndex: number;
  onWeekChange: (index: number) => void;
  renderMobileDay: (day: TDay) => ReactNode;
  renderDesktopCell: (day: TDay) => ReactNode;
  desktopCellClassName?: string;
  mobileAriaLabel?: string;
  className?: string;
}

export function WeekCalendar<TDay extends WeekCalendarDay>({
  weeks,
  currentWeekIndex,
  onWeekChange,
  renderMobileDay,
  renderDesktopCell,
  desktopCellClassName = "",
  mobileAriaLabel,
  className = "",
}: WeekCalendarProps<TDay>) {
  const currentWeek = weeks[currentWeekIndex];

  const MobileWrapper = mobileAriaLabel ? "section" : "div";

  return (
    <div className={className}>
      {/* Mobile view - canonical accessible version */}
      <MobileWrapper
        className="block md:hidden"
        {...(mobileAriaLabel ? { "aria-label": mobileAriaLabel } : {})}
      >
        <WeekNavigation
          currentWeekIndex={currentWeekIndex}
          totalWeeks={weeks.length}
          onWeekChange={onWeekChange}
        />

        <ul className="space-y-3 list-none p-0 m-0">
          {currentWeek?.days.map((day) => {
            if (day.hidden) return null;
            return (
              <li key={day.localDate}>{renderMobileDay(day)}</li>
            );
          })}
        </ul>
      </MobileWrapper>

      {/* Desktop view - visual-only duplicate */}
      <div
        className="hidden md:block overflow-x-auto"
        aria-hidden="true"
      >
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
                        className={`border-r border-b border-[var(--color-border)] last:border-r-0 w-1/5 ${desktopCellClassName}`}
                      >
                        {renderDesktopCell(day)}
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
