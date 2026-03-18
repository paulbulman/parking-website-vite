import { useReservations } from "../../hooks/api/queries/reservations";
import { QueryPage } from "../../components/ui";
import { EditReservationsContent } from "./EditReservationsContent";

function EditReservationsPage() {
  return (
    <QueryPage title="Edit Reservations" query={useReservations()}>
      {(data) => <EditReservationsContent data={data} />}
    </QueryPage>
  );
}

export default EditReservationsPage;
