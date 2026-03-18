import { useState } from "react";
import { useEditReservations } from "../../hooks/api/mutations/editReservations";
import { useCalendarChanges } from "../../hooks/useCalendarChanges";
import { Button, Alert } from "../../components/ui";
import { ReservationsCalendar } from "./ReservationsCalendar";
import type { components } from "../../hooks/api/types";

type ReservationsResponse = components["schemas"]["ReservationsResponse"];

export function EditReservationsContent({
  users,
  shortLeadTimeSpaces,
  reservations,
}: ReservationsResponse) {
  const { editReservations, isSaving, isError } = useEditReservations();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const initialSelections: Record<string, string[]> = Object.fromEntries(
    reservations.weeks
      .flatMap((week) => week.days)
      .filter((day) => !day.hidden && day.data)
      .map((day) => [day.localDate, day.data!.userIds])
  );

  const {
    merged: selections,
    changes: changedSelections,
    update,
    reset,
  } = useCalendarChanges(initialSelections);

  const handleSelectionChange = (
    localDate: string,
    index: number,
    userId: string
  ) => {
    const currentSelections = selections[localDate] || [];
    const newSelections = [...currentSelections];
    newSelections[index] = userId;
    update(localDate, newSelections);
  };

  const handleSave = async () => {
    setSaveSuccess(false);

    try {
      const reservationsArray = Object.entries(changedSelections).map(
        ([localDate, userIds]) => ({
          localDate,
          userIds: userIds.filter((id) => id !== ""),
        })
      );

      await editReservations({ reservations: reservationsArray });

      reset();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Prevent reset/notification; error state is tracked by the mutation hook
    }
  };

  return (
    <>
      <ReservationsCalendar
        calendarData={reservations}
        users={users}
        shortLeadTimeSpaces={shortLeadTimeSpaces}
        selections={selections}
        onSelectionChange={handleSelectionChange}
        initialWeekIndex={currentWeekIndex}
        onWeekChange={setCurrentWeekIndex}
      />

      <div className="flex gap-4 items-center">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {saveSuccess && (
          <Alert variant="success" className="py-2">
            Reservations saved successfully!
          </Alert>
        )}
        {isError && (
          <Alert variant="error" className="py-2">
            Failed to save reservations. Please try again.
          </Alert>
        )}
      </div>
    </>
  );
}
