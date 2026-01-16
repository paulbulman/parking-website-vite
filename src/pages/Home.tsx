import { useNavigate } from "react-router-dom";
import { useSummary } from "../hooks/api/queries/summary";

function Home() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSummary();

  if (isLoading) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p>Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p className="text-red-600">
          Error loading summary data: {error.message}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "allocated":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "interrupted":
      case "hardInterrupted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "allocated":
        return "Allocated";
      case "pending":
        return "Pending";
      case "interrupted":
      case "hardInterrupted":
        return "Interrupted";
      default:
        return "-";
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Summary</h1>

      <div className="mb-4">
        <button
          onClick={() => navigate("/edit-requests")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Requests
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 table-fixed">
          <tbody>
            {data?.summary.weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.days.map((day, dayIndex) => {
                  if (day.hidden) {
                    return (
                      <td
                        key={dayIndex}
                        className="border border-gray-300 p-0 w-1/5"
                      ></td>
                    );
                  }

                  const statusColor = getStatusColor(day.data?.status);
                  const isProblem = day.data?.isProblem;
                  const date = new Date(day.localDate);
                  const dayOfMonth = date.getDate();
                  const dayOfWeek = date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });

                  return (
                    <td
                      key={dayIndex}
                      onClick={() =>
                        navigate(`/daily-details/${day.localDate}`)
                      }
                      className={`border border-gray-300 p-4 text-center cursor-pointer hover:opacity-80 w-1/5 ${statusColor} ${
                        isProblem ? "ring-2 ring-red-500 ring-inset" : ""
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {dayOfWeek}
                      </div>
                      <div className="text-lg font-semibold mb-1">
                        {dayOfMonth}
                      </div>
                      <div className="text-sm font-medium">
                        {getStatusLabel(day.data?.status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
