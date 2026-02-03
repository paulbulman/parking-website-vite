import { useState } from "react";
import { useReservations } from "../hooks/api/queries/reservations";
import { useEditReservations } from "../hooks/api/mutations/editReservations";
import { Button, PageHeader, Alert } from "../components/ui";
import ReservationsCalendar from "../components/ReservationsCalendar";

function EditReservations() {
  const { data, isLoading, error } = useReservations();
  const { editReservations, isSaving } = useEditReservations();

  const [changedSelections, setChangedSelections] = useState<
    Record<string, string[]>
  >({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const initialSelections: Record<string, string[]> = Object.fromEntries(
    (data?.reservations.weeks ?? [])
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

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-text-secondary)]">
          Loading reservations data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-danger)]">
          Error loading reservations: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Edit Reservations" />
        <p className="text-[var(--color-text-secondary)]">No data available.</p>
      </div>
    );
  }

  const { users, shortLeadTimeSpaces, reservations } = data;

  return (
    <div>
      <PageHeader title="Edit Reservations" />

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
    </div>
  );
}

export default EditReservations;
