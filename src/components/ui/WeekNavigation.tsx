import { Button } from "./Button";

interface WeekNavigationProps {
  currentWeekIndex: number;
  totalWeeks: number;
  onWeekChange: (index: number) => void;
}

export function WeekNavigation({
  currentWeekIndex,
  totalWeeks,
  onWeekChange,
}: WeekNavigationProps) {
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < totalWeeks - 1;

  return (
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
          onWeekChange(Math.min(totalWeeks - 1, currentWeekIndex + 1))
        }
        disabled={!hasNextWeek}
      >
        Next week
      </Button>
    </div>
  );
}

