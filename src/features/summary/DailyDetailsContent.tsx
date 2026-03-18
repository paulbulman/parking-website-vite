import { useState } from "react";
import { useStayInterrupted } from "../../hooks/api/mutations/stayInterrupted";
import { Button, Input } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type DailyDetailsResponse = components["schemas"]["DailyDetailsResponse"];

export function DailyDetailsContent({
  data,
  urlDate,
}: {
  data: DailyDetailsResponse;
  urlDate?: string;
}) {
  const { stayInterrupted, isSaving } = useStayInterrupted();

  const availableDates = data.details.filter((d) => !d.hidden);
  const availableDateStrings = availableDates.map((d) => d.localDate);

  const initialDate =
    urlDate ?? availableDates[0]?.localDate ?? "";

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const selectedDayData = data.details.find(
    (d) => d.localDate === selectedDate
  )?.data;

  const allocatedUsers = selectedDayData?.allocatedUsers || [];
  const interruptedUsers = selectedDayData?.interruptedUsers || [];
  const pendingUsers = selectedDayData?.pendingUsers || [];
  const stayInterruptedStatus = selectedDayData?.stayInterruptedStatus;

  const hasAnyUsers =
    allocatedUsers.length > 0 ||
    interruptedUsers.length > 0 ||
    pendingUsers.length > 0;

  const handleDateChange = (newDate: string) => {
    if (availableDateStrings.includes(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleStayInterruptedToggle = async () => {
    if (!selectedDate || !selectedDayData?.stayInterruptedStatus) return;

    try {
      await stayInterrupted({
        localDate: selectedDate,
        stayInterrupted: !selectedDayData.stayInterruptedStatus.isSet,
      });
    } catch (error) {
      console.error("Error toggling stay interrupted:", error);
    }
  };

  const minDate = availableDates[0]?.localDate;
  const maxDate = availableDates[availableDates.length - 1]?.localDate;

  return (
    <>
      <div className="mb-6">
        <Input
          id="date-picker"
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          className="max-w-xs"
        />
      </div>

      {!hasAnyUsers && (
        <p className="text-[var(--color-text-secondary)]">
          There are no requests for the selected date.
        </p>
      )}

      {hasAnyUsers && (
        <div className="space-y-6">
          {allocatedUsers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                Allocated ({allocatedUsers.length})
              </h2>
              <ul className="space-y-2" aria-label="Allocated users">
                {allocatedUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2.5 status-allocated rounded-md ${
                      user.isHighlighted ? "font-semibold" : ""
                    }`}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {interruptedUsers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                Interrupted ({interruptedUsers.length})
              </h2>
              <ul className="space-y-2" aria-label="Interrupted users">
                {interruptedUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2.5 status-interrupted rounded-md ${
                      user.isHighlighted ? "font-semibold" : ""
                    }`}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pendingUsers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                Pending ({pendingUsers.length})
              </h2>
              <ul className="space-y-2" aria-label="Pending users">
                {pendingUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2.5 status-pending rounded-md ${
                      user.isHighlighted ? "font-semibold" : ""
                    }`}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {stayInterruptedStatus?.isAllowed && (
        <div className="mt-8">
          <Button onClick={handleStayInterruptedToggle} disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : stayInterruptedStatus.isSet
                ? "Re-request space"
                : "Stay interrupted"}
          </Button>
        </div>
      )}
    </>
  );
}
