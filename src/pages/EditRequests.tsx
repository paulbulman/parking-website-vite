import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";
import { useEditRequests } from "../hooks/api/mutations/editRequests";

function EditRequests() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSummary();
  const { editRequests, isSaving } = useEditRequests();
  const [initialRequests, setInitialRequests] = useState<Record<string, boolean>>({});
  const [requests, setRequests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (data?.summary.weeks) {
      const initialState: Record<string, boolean> = {};
      data.summary.weeks.forEach((week) => {
        week.days.forEach((day) => {
          if (!day.hidden) {
            initialState[day.localDate] = day.data?.status != null;
          }
        });
      });
      setInitialRequests(initialState);
      setRequests(initialState);
    }
  }, [data]);

  const handleCheckboxChange = (localDate: string) => {
    setRequests((prev) => ({
      ...prev,
      [localDate]: !prev[localDate],
    }));
  };

  const handleSave = async () => {
    try {
      const requestsArray = Object.entries(requests)
        .filter(([localDate, requested]) => initialRequests[localDate] !== requested)
        .map(([localDate, requested]) => ({
          localDate,
          requested,
        }));

      await editRequests({ requests: requestsArray });
      navigate("/");
    } catch (error) {
      console.error("Error saving requests:", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Requests</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit Requests</h1>
        <p className="text-red-600">Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Requests</h1>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            {data?.summary.weeks.map((week, weekIndex) => (
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
                  const isChecked = requests[day.localDate] || false;

                  return (
                    <td
                      key={dayIndex}
                      className="border border-gray-300 p-4 text-center bg-white hover:bg-gray-50"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        {dayOfMonth}
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(day.localDate)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditRequests;
