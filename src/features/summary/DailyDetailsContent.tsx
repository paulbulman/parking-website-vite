import { useState } from "react";
import { useStayInterrupted } from "../../hooks/api/mutations/stayInterrupted";
import { Alert, Button, Input } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type DailyDetailsResponse = components["schemas"]["DailyDetailsResponse"];
type User = { name: string; isHighlighted: boolean };

function UserList({
  title,
  users,
  colorClass,
}: {
  title: string;
  users: User[];
  colorClass: string;
}) {
  if (users.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
        {title} ({users.length})
      </h2>
      <ul className="space-y-2" aria-label={`${title} users`}>
        {users.map((user, index) => (
          <li
            key={index}
            className={`px-4 py-2.5 ${colorClass} rounded-md ${
              user.isHighlighted ? "font-semibold" : ""
            }`}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DailyDetailsContent({
  details,
  urlDate,
}: {
  details: DailyDetailsResponse["details"];
  urlDate?: string;
}) {
  const { stayInterrupted, isSaving, isError } = useStayInterrupted();

  const availableDates = details.filter((d) => !d.hidden);
  const availableDateStrings = availableDates.map((d) => d.localDate);

  const initialDate =
    urlDate ?? availableDates[0]?.localDate ?? "";

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const selectedDayData = details.find(
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

  const handleStayInterruptedToggle = () => {
    if (!selectedDate || !selectedDayData?.stayInterruptedStatus) return;

    stayInterrupted({
      localDate: selectedDate,
      stayInterrupted: !selectedDayData.stayInterruptedStatus.isSet,
    });
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
          <UserList title="Allocated" users={allocatedUsers} colorClass="color-success" />
          <UserList title="Interrupted" users={interruptedUsers} colorClass="color-danger" />
          <UserList title="Pending" users={pendingUsers} colorClass="color-warning" />
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
          {isError && (
            <Alert variant="error" className="py-2">
              Failed to update status. Please try again.
            </Alert>
          )}
        </div>
      )}
    </>
  );
}
