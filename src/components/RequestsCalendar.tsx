interface CalendarData {
  weeks: Array<{
    days: Array<{
      localDate: string;
      hidden: boolean;
      data?: unknown;
    }>;
  }>;
}

interface RequestsCalendarProps {
  calendarData: CalendarData;
  requests: Record<string, boolean>;
  onCheckboxChange?: (localDate: string) => void;
  readOnly?: boolean;
}

function RequestsCalendar({
  calendarData,
  requests,
  onCheckboxChange,
  readOnly = false,
}: RequestsCalendarProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border-collapse border border-gray-300">
        <tbody>
          {calendarData.weeks.map((week, weekIndex) => (
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
                const dayOfWeek = date.toLocaleDateString("en-GB", {
                  weekday: "short",
                });
                const monthName = date.toLocaleDateString("en-GB", {
                  month: "short",
                });
                const isChecked = requests[day.localDate] || false;

                return (
                  <td
                    key={dayIndex}
                    onClick={() =>
                      !readOnly && onCheckboxChange?.(day.localDate)
                    }
                    className={`border border-gray-300 p-4 text-center bg-white hover:bg-gray-50 ${
                      !readOnly ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      {dayOfWeek}
                    </div>
                    <div className="text-lg font-semibold mb-2">
                      {dayOfMonth} {monthName}
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        disabled={readOnly}
                        className="w-5 h-5 pointer-events-none"
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
  );
}

export default RequestsCalendar;
