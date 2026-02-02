import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersList } from "../hooks/api/queries/usersList";
import { useUserRequests } from "../hooks/api/queries/userRequests";
import { useEditUserRequests } from "../hooks/api/mutations/editUserRequests";
import RequestsCalendar from "../components/RequestsCalendar";

function OverrideRequests() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [initialRequests, setInitialRequests] = useState<Record<string, boolean>>({});
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [prevUserRequestsData, setPrevUserRequestsData] = useState<typeof userRequestsData>(undefined);

  const { data: usersListData, isLoading: isLoadingUsers, error: usersError } = useUsersList();
  const {
    data: userRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError
  } = useUserRequests({ userId: selectedUserId });
  const { editUserRequests, isSaving } = useEditUserRequests({ userId: selectedUserId });

  if (userRequestsData !== prevUserRequestsData) {
    setPrevUserRequestsData(userRequestsData);
    if (userRequestsData?.requests.weeks) {
      const initialState: Record<string, boolean> = {};
      userRequestsData.requests.weeks.forEach((week) => {
        week.days.forEach((day) => {
          if (!day.hidden && day.data) {
            initialState[day.localDate] = day.data.requested;
          }
        });
      });
      setInitialRequests(initialState);
      setRequests(initialState);
    } else {
      setInitialRequests({});
      setRequests({});
    }
  }

  const handleCheckboxChange = (localDate: string) => {
    setRequests((prev) => ({
      ...prev,
      [localDate]: !prev[localDate],
    }));
  };

  const handleSave = async () => {
    if (!selectedUserId) return;

    try {
      const requestsArray = Object.entries(requests)
        .filter(([localDate, requested]) => initialRequests[localDate] !== requested)
        .map(([localDate, requested]) => ({
          localDate,
          requested,
        }));

      await editUserRequests({ requests: requestsArray });
      navigate("/");
    } catch (error) {
      console.error("Error saving requests:", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoadingUsers) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Override Requests</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Override Requests</h1>
        <p className="text-red-600">Error loading users: {usersError.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Override Requests</h1>

      <div className="mb-6">
        <label htmlFor="user-select" className="block text-sm font-medium mb-2">
          Select User
        </label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px]"
        >
          <option value="">-- Select a user --</option>
          {usersListData?.users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedUserId && (
        <p className="text-gray-600">Please select a user to view their requests.</p>
      )}

      {selectedUserId && isLoadingRequests && (
        <p>Loading requests...</p>
      )}

      {selectedUserId && requestsError && (
        <p className="text-red-600">Error loading requests: {requestsError.message}</p>
      )}

      {selectedUserId && userRequestsData?.requests && (
        <>
          <RequestsCalendar
            calendarData={userRequestsData.requests}
            requests={requests}
            onCheckboxChange={handleCheckboxChange}
          />

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
        </>
      )}
    </div>
  );
}

export default OverrideRequests;
