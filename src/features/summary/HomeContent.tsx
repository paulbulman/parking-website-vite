import { Button } from "../../components/ui";
import { DayLink } from "./DayLink";
import type { components } from "../../hooks/api/types";

type CalendarOfSummaryData = components["schemas"]["CalendarOfSummaryData"];

export function HomeContent({
  summary,
  currentWeekIndex,
  onWeekChange,
}: {
  summary: CalendarOfSummaryData;
  currentWeekIndex: number;
  onWeekChange: (index: number) => void;
}) {
  const weeks = summary.weeks;
  const currentWeek = weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < weeks.length - 1;

  return (
    <>
      {/* Mobile view - single column with week navigation */}
      <nav className="block md:hidden" aria-label="Weekly summary">
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => onWeekChange(Math.max(0, currentWeekIndex - 1))}
            disabled={!hasPreviousWeek}
          >
            Previous week
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              onWeekChange(Math.min(weeks.length - 1, currentWeekIndex + 1))
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
    </>
  );
}
