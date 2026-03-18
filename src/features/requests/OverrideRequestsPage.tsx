import { useUsersList } from "../../hooks/api/queries/usersList";
import { QueryPage } from "../../components/ui";
import { OverrideRequestsContent } from "./OverrideRequestsContent";

function OverrideRequestsPage() {
  return (
    <QueryPage title="Override Requests" query={useUsersList()}>
      {(data) => <OverrideRequestsContent users={data.users} />}
    </QueryPage>
  );
}

export default OverrideRequestsPage;
