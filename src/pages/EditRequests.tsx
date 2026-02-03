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
  const [changedRequests, setChangedRequests] = useState<
    Record<string, boolean>
  >({});

  const initialWeekIndex = parseInt(searchParams.get("week") ?? "0", 10) || 0;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  const initialRequests: Record<string, boolean> = Object.fromEntries(
    (data?.requests.weeks ?? [])
      .flatMap((week) => week.days)
      .filter((day) => !day.hidden && day.data)
      .map((day) => [day.localDate, day.data!.requested])
  );

  const requests = { ...initialRequests, ...changedRequests };

  const handleCheckboxChange = (localDate: string) => {
    setChangedRequests((prev) => ({
      ...prev,
      [localDate]: !requests[localDate],
    }));
  };

  const handleSave = async () => {
    try {
      const requestsArray = Object.entries(changedRequests).map(
        ([localDate, requested]) => ({
          localDate,
          requested,
        })
      );

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
