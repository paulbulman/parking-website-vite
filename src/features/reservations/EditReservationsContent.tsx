import { useState } from "react";
import { useEditReservations } from "../../hooks/api/mutations/editReservations";
import { Button, Alert } from "../../components/ui";
import ReservationsCalendar from "./ReservationsCalendar";
import type { components } from "../../hooks/api/types";

type ReservationsResponse = components["schemas"]["ReservationsResponse"];

export function EditReservationsContent({ data }: { data: ReservationsResponse }) {
  const { editReservations, isSaving } = useEditReservations();

  const [changedSelections, setChangedSelections] = useState<
    Record<string, string[]>
  >({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const { users, shortLeadTimeSpaces, reservations } = data;

  const initialSelections: Record<string, string[]> = Object.fromEntries(
    reservations.weeks
      .flatMap((week) => week.days)
      .filter((day) => !day.hidden && day.data)
      .map((day) => [day.localDate, day.data!.userIds])
  );

  const selections: Record<string, string[]> = Object.fromEntries(
    Object.keys(initialSelections).map((localDate) => [
      localDate,
      changedSelections[localDate] ?? initialSelections[localDate],
    ])
  );

  const handleSelectionChange = (
    localDate: string,
    index: number,
    userId: string
  ) => {
    const currentSelections = selections[localDate] || [];
    const newSelections = [...currentSelections];
    newSelections[index] = userId;
    setChangedSelections((prev) => ({
      ...prev,
      [localDate]: newSelections,
    }));
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

      setChangedSelections({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving reservations:", error);
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
      </div>
    </>
  );
}
