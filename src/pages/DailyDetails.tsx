import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDailyDetails } from "../hooks/api/queries/dailyDetails";
import { useStayInterrupted } from "../hooks/api/mutations/stayInterrupted";

function DailyDetails() {
  const { date } = useParams<{ date: string }>();
  const { data, isLoading, error } = useDailyDetails();
  const { stayInterrupted, isSaving } = useStayInterrupted();

  const [selectedDate, setSelectedDate] = useState<string>(date || "");

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    } else if (data?.details && data.details.length > 0) {
      // If no date in URL, default to first available date
      const firstAvailableDate = data.details.find((d) => !d.hidden);
      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate.localDate);
      }
    }
  }, [date, data]);

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
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Daily Details</h1>
        <p>Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Daily Details</h1>
        <p className="text-red-600">Error loading details: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Daily Details</h1>
        <p>No data available.</p>
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
    // Only allow selection of available dates
    if (availableDateStrings.includes(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const minDate = availableDates[0]?.localDate;
  const maxDate = availableDates[availableDates.length - 1]?.localDate;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Daily Details</h1>

      <div className="mb-6">
        <label htmlFor="date-picker" className="block text-sm font-medium mb-2">
          Select Date
        </label>
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!hasAnyUsers && (
        <p className="text-gray-600">
          There are no requests for the selected date.
        </p>
      )}

      {hasAnyUsers && (
        <div className="space-y-6">
          {allocatedUsers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">
                Allocated ({allocatedUsers.length})
              </h2>
              <ul className="space-y-2">
                {allocatedUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 bg-green-100 text-green-800 border border-gray-300 rounded ${
                      user.isHighlighted ? "font-bold" : ""
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
              <h2 className="text-xl font-bold mb-3">
                Interrupted ({interruptedUsers.length})
              </h2>
              <ul className="space-y-2">
                {interruptedUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 bg-red-100 text-red-800 border border-gray-300 rounded ${
                      user.isHighlighted ? "font-bold" : ""
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
              <h2 className="text-xl font-bold mb-3">
                Pending ({pendingUsers.length})
              </h2>
              <ul className="space-y-2">
                {pendingUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 bg-orange-100 text-orange-800 border border-gray-300 rounded ${
                      user.isHighlighted ? "font-bold" : ""
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
        <div className="mt-6">
          <button
            onClick={handleStayInterruptedToggle}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving
              ? "Saving..."
              : stayInterruptedStatus.isSet
                ? "Re-request space"
                : "Stay interrupted"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DailyDetails;
