import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersList } from "../hooks/api/queries/usersList";
import { useUserRequests } from "../hooks/api/queries/userRequests";
import { useEditUserRequests } from "../hooks/api/mutations/editUserRequests";
import RequestsCalendar from "../components/RequestsCalendar";
import { Button, Select, PageHeader } from "../components/ui";

function OverrideRequests() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [initialRequests, setInitialRequests] = useState<
    Record<string, boolean>
  >({});
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [prevUserRequestsData, setPrevUserRequestsData] =
    useState<typeof userRequestsData>(undefined);

  const {
    data: usersListData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useUsersList();
  const {
    data: userRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useUserRequests({ userId: selectedUserId });
  const { editUserRequests, isSaving } = useEditUserRequests({
    userId: selectedUserId,
  });

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
        .filter(
          ([localDate, requested]) => initialRequests[localDate] !== requested
        )
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
      <div>
        <PageHeader title="Override Requests" />
        <p className="text-[var(--color-text-secondary)]">Loading users...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div>
        <PageHeader title="Override Requests" />
        <p className="text-[var(--color-danger)]">
          Error loading users: {usersError.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Override Requests" />

      <div className="mb-6 max-w-sm">
        <Select
          id="user-select"
          label="Select User"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">(None)</option>
          {usersListData?.users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>

      {!selectedUserId && (
        <p className="text-[var(--color-text-secondary)]">
          Please select a user to update their requests.
        </p>
      )}

      {selectedUserId && isLoadingRequests && (
        <p className="text-[var(--color-text-secondary)]">Loading requests...</p>
      )}

      {selectedUserId && requestsError && (
        <p className="text-[var(--color-danger)]">
          Error loading requests: {requestsError.message}
        </p>
      )}

      {selectedUserId && userRequestsData?.requests && (
        <>
          <RequestsCalendar
            calendarData={userRequestsData.requests}
            requests={requests}
            onCheckboxChange={handleCheckboxChange}
          />

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default OverrideRequests;
