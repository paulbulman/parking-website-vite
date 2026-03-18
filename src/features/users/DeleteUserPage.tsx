import { useParams } from "react-router";
import { useUser } from "../../hooks/api/queries/user";
import { Button, QueryPage } from "../../components/ui";
import { DeleteUserContent } from "./DeleteUserContent";

function DeleteUserPage() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <QueryPage title="Delete User" query={useUser({ userId: userId ?? "" })}>
      {(data) =>
        data.user ? (
          <DeleteUserContent user={data.user} userId={userId ?? ""} />
        ) : (
          <>
            <p className="text-[var(--color-danger)] mb-4">User not found.</p>
            <Button variant="secondary" onClick={() => history.back()}>
              Back to Users
            </Button>
          </>
        )
      }
    </QueryPage>
  );
}

export default DeleteUserPage;
