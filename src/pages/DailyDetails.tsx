import { useState } from "react";
import { useParams } from "react-router";
import { useDailyDetails } from "../hooks/api/queries/dailyDetails";
import { useStayInterrupted } from "../hooks/api/mutations/stayInterrupted";
import { Button, Input, PageHeader } from "../components/ui";

function DailyDetails() {
  const { date } = useParams<{ date: string }>();
  const { data, isLoading, error } = useDailyDetails();
  const { stayInterrupted, isSaving } = useStayInterrupted();

  const [selectedDate, setSelectedDate] = useState<string>(date || "");
  const [prevDate, setPrevDate] = useState(date);
  const [prevData, setPrevData] = useState(data);

  if (date !== prevDate) {
    setPrevDate(date);
    if (date) {
      setSelectedDate(date);
    }
  }

  if (data !== prevData) {
    setPrevData(data);
    if (!date && data?.details && data.details.length > 0) {
      const firstAvailableDate = data.details.find((d) => !d.hidden);
      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate.localDate);
      }
    }
  }

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

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Daily Details" />
        <p className="text-[var(--color-text-secondary)]">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Daily Details" />
        <p className="text-[var(--color-danger)]">
          Error loading details: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Daily Details" />
        <p className="text-[var(--color-text-secondary)]">No data available.</p>
      </div>
    );
  }

  const availableDates = data.details.filter((d) => !d.hidden);
  const availableDateStrings = availableDates.map((d) => d.localDate);
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

  const minDate = availableDates[0]?.localDate;
  const maxDate = availableDates[availableDates.length - 1]?.localDate;

  return (
    <div>
      <PageHeader title="Daily Details" />

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
              <ul className="space-y-2">
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
              <ul className="space-y-2">
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
              <ul className="space-y-2">
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
    </div>
  );
}

export default DailyDetails;
