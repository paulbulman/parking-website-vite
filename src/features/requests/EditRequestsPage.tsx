import { useSearchParams } from "react-router-dom";
import { useRequests } from "../../hooks/api/queries/requests";
import { QueryPage } from "../../components/ui";
import { EditRequestsContent } from "./EditRequestsContent";

function EditRequestsPage() {
  const [searchParams] = useSearchParams();
  const initialWeekIndex = parseInt(searchParams.get("week") ?? "0", 10) || 0;

  return (
    <QueryPage title="Edit Requests" query={useRequests()}>
      {(data) => (
        <EditRequestsContent
          requests={data.requests}
          initialWeekIndex={initialWeekIndex}
        />
      )}
    </QueryPage>
  );
}

export default EditRequestsPage;
