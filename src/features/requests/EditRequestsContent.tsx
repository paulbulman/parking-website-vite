import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditRequests } from "../../hooks/api/mutations/editRequests";
import { useCalendarChanges } from "../../hooks/useCalendarChanges";
import { RequestsCalendar } from "./RequestsCalendar";
import { Button, Alert } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type CalendarOfRequestsData = components["schemas"]["CalendarOfRequestsData"];

export function EditRequestsContent({
  requests: calendarData,
  initialWeekIndex,
}: {
  requests: CalendarOfRequestsData;
  initialWeekIndex: number;
}) {
  const navigate = useNavigate();
  const { editRequests, isSaving, isError } = useEditRequests();
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  const initialRequests: Record<string, boolean> = Object.fromEntries(
    calendarData.weeks
      .flatMap((week) => week.days)
      .filter((day) => !day.hidden && day.data)
      .map((day) => [day.localDate, day.data!.requested])
  );

  const {
    merged: requests,
    changes: changedRequests,
    update,
  } = useCalendarChanges(initialRequests);

  const handleCheckboxChange = (localDate: string) => {
    update(localDate, !requests[localDate]);
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
    } catch {
      // Prevent navigation; error state is tracked by the mutation hook
    }
  };

  const handleCancel = () => {
    navigate(`/?week=${currentWeekIndex}`);
  };

  return (
    <>
      <RequestsCalendar
        calendarData={calendarData}
        requests={requests}
        onCheckboxChange={handleCheckboxChange}
        initialWeekIndex={initialWeekIndex}
        onWeekChange={setCurrentWeekIndex}
      />

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        {isError && (
          <Alert variant="error" className="py-2">
            Failed to save requests. Please try again.
          </Alert>
        )}
      </div>
    </>
  );
}
