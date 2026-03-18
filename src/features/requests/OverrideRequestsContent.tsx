import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRequests } from "../../hooks/api/queries/userRequests";
import { useEditUserRequests } from "../../hooks/api/mutations/editUserRequests";
import { useCalendarChanges } from "../../hooks/useCalendarChanges";
import { RequestsCalendar } from "./RequestsCalendar";
import { Alert, Button, Select } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type UsersListUser = components["schemas"]["UsersListUser"];

export function OverrideRequestsContent({ users }: { users: UsersListUser[] }) {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const {
    data: userRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useUserRequests({ userId: selectedUserId });
  const { editUserRequests, isSaving, isError } = useEditUserRequests({
    userId: selectedUserId,
  });

  const initialRequests: Record<string, boolean> = Object.fromEntries(
    (userRequestsData?.requests.weeks ?? [])
      .flatMap((week) => week.days)
      .filter((day) => !day.hidden && day.data)
      .map((day) => [day.localDate, day.data!.requested])
  );

  const {
    merged: requests,
    changes: changedRequests,
    update,
    reset,
  } = useCalendarChanges(initialRequests);

  const handleCheckboxChange = (localDate: string) => {
    update(localDate, !requests[localDate]);
  };

  const handleSave = async () => {
    if (!selectedUserId) return;

    try {
      const requestsArray = Object.entries(changedRequests).map(
        ([localDate, requested]) => ({
          localDate,
          requested,
        })
      );

      await editUserRequests({ requests: requestsArray });
      navigate("/");
    } catch {
      // Prevent navigation; error state is tracked by the mutation hook
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      <div className="mb-6 max-w-sm">
        <Select
          id="user-select"
          label="Select User"
          value={selectedUserId}
          onChange={(e) => {
            setSelectedUserId(e.target.value);
            reset();
          }}
        >
          <option value="">(None)</option>
          {users.map((user) => (
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
            {isError && (
              <Alert variant="error" className="py-2">
                Failed to save requests. Please try again.
              </Alert>
            )}
          </div>
        </>
      )}
    </>
  );
}
