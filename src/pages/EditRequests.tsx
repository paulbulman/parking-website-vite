import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRequests } from "../hooks/api/queries/requests";
import { useEditRequests } from "../hooks/api/mutations/editRequests";
import RequestsCalendar from "../components/RequestsCalendar";
import { Button, PageHeader } from "../components/ui";

function EditRequests() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, isLoading, error } = useRequests();
  const { editRequests, isSaving } = useEditRequests();
  const [initialRequests, setInitialRequests] = useState<
    Record<string, boolean>
  >({});
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [prevData, setPrevData] = useState(data);

  const initialWeekIndex = parseInt(searchParams.get("week") ?? "0", 10) || 0;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  if (data !== prevData) {
    setPrevData(data);
    if (data?.requests.weeks) {
      const initialState: Record<string, boolean> = {};
      data.requests.weeks.forEach((week) => {
        week.days.forEach((day) => {
          if (!day.hidden && day.data) {
            initialState[day.localDate] = day.data.requested;
          }
        });
      });
      setInitialRequests(initialState);
      setRequests(initialState);
    }
  }

  const handleCheckboxChange = (localDate: string) => {
    setRequests((prev) => ({
      ...prev,
      [localDate]: !prev[localDate],
    }));
  };

  const handleSave = async () => {
    try {
      const requestsArray = Object.entries(requests)
        .filter(
          ([localDate, requested]) => initialRequests[localDate] !== requested
        )
        .map(([localDate, requested]) => ({
          localDate,
          requested,
        }));

      await editRequests({ requests: requestsArray });
      navigate(`/?week=${currentWeekIndex}`);
    } catch (error) {
      console.error("Error saving requests:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/?week=${currentWeekIndex}`);
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Edit Requests" />
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Edit Requests" />
        <p className="text-[var(--color-danger)]">
          Error loading data: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Requests" />

      {data?.requests && (
        <RequestsCalendar
          calendarData={data.requests}
          requests={requests}
          onCheckboxChange={handleCheckboxChange}
          initialWeekIndex={initialWeekIndex}
          onWeekChange={setCurrentWeekIndex}
        />
      )}

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default EditRequests;
