import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";
import { useEditRequests } from "../hooks/api/mutations/editRequests";
import RequestsCalendar from "../components/RequestsCalendar";

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

      {data?.summary && (
        <RequestsCalendar
          calendarData={data.summary}
          requests={requests}
          onCheckboxChange={handleCheckboxChange}
        />
      )}

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
