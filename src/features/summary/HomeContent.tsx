import { WeekCalendar } from "../../components/ui";
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
  return (
    <WeekCalendar
      weeks={summary.weeks}
      currentWeekIndex={currentWeekIndex}
      onWeekChange={onWeekChange}
      mobileAriaLabel="Weekly summary"
      renderMobileDay={(day) => <DayLink day={day} variant="mobile" />}
      renderDesktopCell={(day) => <DayLink day={day} variant="desktop" />}
    />
  );
}
