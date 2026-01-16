import { useState, useEffect } from "react";
import { useReservations } from "../hooks/api/queries/reservations";

function EditReservations() {
  const { data, isLoading, error } = useReservations();

  // State to track the selected users for each day
  // Structure: { [localDate]: string[] } where string[] is array of userIds
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  // Initialize selections when data loads
  useEffect(() => {
    if (data?.reservations) {
      const initialSelections: Record<string, string[]> = {};

      data.reservations.weeks.forEach((week) => {
        week.days.forEach((day) => {
          if (!day.hidden && day.data) {
            initialSelections[day.localDate] = [...day.data.userIds];
          }
        });
      });

      setSelections(initialSelections);
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

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Reservations</h1>

      <div className="overflow-x-auto">
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

                  const date = new Date(day.localDate);
                  const dayOfMonth = date.getDate();
                  const dayOfWeek = date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });

                  const currentSelections = selections[day.localDate] || [];

                  return (
                    <td
                      key={dayIndex}
                      className="border border-gray-300 p-4 text-center bg-white align-top"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-semibold mb-3">
                        {dayOfMonth}
                      </div>

                      {/* Render dropdowns based on shortLeadTimeSpaces */}
                      <div className="space-y-2">
                        {Array.from({ length: shortLeadTimeSpaces }).map(
                          (_, index) => (
                            <select
                              key={index}
                              value={currentSelections[index] || ""}
                              onChange={(e) =>
                                handleSelectionChange(
                                  day.localDate,
                                  index,
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">None</option>
                              {users.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                          )
                        )}
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
  );
}

export default EditReservations;
