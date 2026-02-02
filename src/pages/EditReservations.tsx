import { useState } from "react";
import { useReservations } from "../hooks/api/queries/reservations";
import { useEditReservations } from "../hooks/api/mutations/editReservations";
import { Button, Select, PageHeader, Alert } from "../components/ui";

interface User {
  userId: string;
  name: string;
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

function EditReservations() {
  const { data, isLoading, error } = useReservations();
  const { editReservations, isSaving } = useEditReservations();

  const [initialSelections, setInitialSelections] = useState<
    Record<string, string[]>
  >({});
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    if (data?.reservations) {
      const initial: Record<string, string[]> = {};

      data.reservations.weeks.forEach((week) => {
        week.days.forEach((day) => {
          if (!day.hidden && day.data) {
            initial[day.localDate] = [...day.data.userIds];
          }
        });
      });

      setInitialSelections(initial);
      setSelections(initial);
    }
  }

  const handleSelectionChange = (
    localDate: string,
    index: number,
    userId: string
  ) => {
    setSelections((prev) => {
      const currentSelections = prev[localDate] || [];
      const newSelections = [...currentSelections];
      newSelections[index] = userId;
      return {
        ...prev,
        [localDate]: newSelections,
      };
    });
  };

  const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  const handleSave = async () => {
    setSaveSuccess(false);

    try {
      const reservationsArray = Object.entries(selections)
        .filter(([localDate, userIds]) => {
          const initial = initialSelections[localDate] || [];
          return !arraysEqual(initial, userIds);
        })
        .map(([localDate, userIds]) => ({
          localDate,
          userIds: userIds.filter((id) => id !== ""),
        }));

      await editReservations({ reservations: reservationsArray });

      setInitialSelections(selections);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving reservations:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-text-secondary)]">
          Loading reservations data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-danger)]">
          Error loading reservations: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-text-secondary)]">No data available.</p>
      </div>
    );
  }

  const { users, shortLeadTimeSpaces, reservations } = data;

  const currentWeek = reservations.weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < reservations.weeks.length - 1;

  return (
    <div>
      <PageHeader title="Edit Reservations" />

      {/* Mobile view - single column with week navigation */}
      <div className="block md:hidden mb-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
            disabled={!hasPreviousWeek}
          >
            Previous week
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentWeekIndex((prev) =>
                Math.min(reservations.weeks.length - 1, prev + 1)
              )
            }
            disabled={!hasNextWeek}
          >
            Next week
          </Button>
        </div>

        <div className="space-y-4">
          {currentWeek.days.map((day, dayIndex) => {
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
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view - table with all weeks */}
      <div className="hidden md:block overflow-x-auto mb-6">
        <div className="card overflow-hidden">
          <table className="min-w-full">
            <tbody>
              {reservations.weeks.map((week, weekIndex) => (
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
                          onSelectionChange={handleSelectionChange}
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

      <div className="flex gap-4 items-center">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {saveSuccess && (
          <Alert variant="success" className="py-2">
            Reservations saved successfully!
          </Alert>
        )}
      </div>
    </div>
  );
}

export default EditReservations;
