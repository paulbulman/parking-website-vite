import { useState, useEffect } from "react";
import { useReservations } from "../hooks/api/queries/reservations";
import { useEditReservations } from "../hooks/api/mutations/editReservations";

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
  dropdownClassName?: string;
}

function ReservationDropdowns({
  localDate,
  users,
  shortLeadTimeSpaces,
  currentSelections,
  onSelectionChange,
  dropdownClassName = "",
}: ReservationDropdownsProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: shortLeadTimeSpaces }).map((_, index) => (
        <select
          key={index}
          value={currentSelections[index] || ""}
          onChange={(e) => onSelectionChange(localDate, index, e.target.value)}
          className={dropdownClassName}
        >
          <option value="">None</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

function EditReservations() {
  const { data, isLoading, error } = useReservations();
  const { editReservations, isSaving } = useEditReservations();

  // State to track the selected users for each day
  // Structure: { [localDate]: string[] } where string[] is array of userIds
  const [initialSelections, setInitialSelections] = useState<
    Record<string, string[]>
  >({});
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State for mobile week navigation
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  // Initialize selections when data loads
  useEffect(() => {
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
  }, [data]);

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
      // Only send days where selections have changed
      const reservationsArray = Object.entries(selections)
        .filter(([localDate, userIds]) => {
          const initial = initialSelections[localDate] || [];
          return !arraysEqual(initial, userIds);
        })
        .map(([localDate, userIds]) => ({
          localDate,
          userIds: userIds.filter((id) => id !== ""), // Remove empty selections
        }));

      await editReservations({ reservations: reservationsArray });

      // Update initial selections to match current selections after successful save
      setInitialSelections(selections);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving reservations:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Reservations</h1>
        <p>Loading reservations data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Reservations</h1>
        <p className="text-red-600">
          Error loading reservations: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Reservations</h1>
        <p>No data available.</p>
      </div>
    );
  }

  const { users, shortLeadTimeSpaces, reservations } = data;

  const currentWeek = reservations.weeks[currentWeekIndex];
  const hasPreviousWeek = currentWeekIndex > 0;
  const hasNextWeek = currentWeekIndex < reservations.weeks.length - 1;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Reservations</h1>

      {/* Mobile view - single column with week navigation */}
      <div className="block md:hidden mb-6">
        {/* Week navigation buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
            disabled={!hasPreviousWeek}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous week
          </button>
          <button
            onClick={() =>
              setCurrentWeekIndex((prev) =>
                Math.min(reservations.weeks.length - 1, prev + 1)
              )
            }
            disabled={!hasNextWeek}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next week
          </button>
        </div>

        {/* Single column day cards */}
        <div className="space-y-4">
          {currentWeek.days.map((day, dayIndex) => {
            if (day.hidden) return null;

            const currentSelections = selections[day.localDate] || [];

            return (
              <div
                key={dayIndex}
                className="border border-gray-300 rounded p-4 bg-white"
              >
                <DayHeader
                  localDate={day.localDate}
                  dayOfWeekClassName="text-sm text-gray-600 mb-1"
                  dateClassName="text-xl font-semibold mb-3"
                />

                <ReservationDropdowns
                  localDate={day.localDate}
                  users={users}
                  shortLeadTimeSpaces={shortLeadTimeSpaces}
                  currentSelections={currentSelections}
                  onSelectionChange={handleSelectionChange}
                  dropdownClassName="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view - table with all weeks */}
      <div className="hidden md:block overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            {reservations.weeks.map((week, weekIndex) => (
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

                  const currentSelections = selections[day.localDate] || [];

                  return (
                    <td
                      key={dayIndex}
                      className="border border-gray-300 p-4 text-center bg-white align-top"
                    >
                      <DayHeader
                        localDate={day.localDate}
                        dayOfWeekClassName="text-xs text-gray-600 mb-1"
                        dateClassName="text-lg font-semibold mb-3"
                      />

                      <ReservationDropdowns
                        localDate={day.localDate}
                        users={users}
                        shortLeadTimeSpaces={shortLeadTimeSpaces}
                        currentSelections={currentSelections}
                        onSelectionChange={handleSelectionChange}
                        dropdownClassName="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        {saveSuccess && (
          <span className="text-green-600 font-semibold">
            Reservations saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}

export default EditReservations;
