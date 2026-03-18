import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/api/queries/user";
import { Button, QueryPage } from "../../components/ui";
import { EditUserContent } from "./EditUserContent";

function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  return (
    <QueryPage title="Edit User" query={useUser({ userId: userId ?? "" })}>
      {(data) =>
        data.user ? (
          <EditUserContent user={data.user} userId={userId ?? ""} />
        ) : (
          <>
            <p className="text-[var(--color-danger)] mb-4">User not found.</p>
            <Button variant="secondary" onClick={() => navigate("/users")}>
              Back to Users
            </Button>
          </>
        )
      }
    </QueryPage>
  );
}

export default EditUserPage;
