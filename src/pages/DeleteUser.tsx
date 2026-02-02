import { useNavigate, useParams } from "react-router";
import { useDeleteUser } from "../hooks/api/mutations/deleteUser";
import { useUser } from "../hooks/api/queries/user";
import { Button, Card, PageHeader, Alert } from "../components/ui";

function DeleteUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUser({ userId: userId ?? "" });
  const { deleteUser, isDeleting } = useDeleteUser();

  const user = data?.user;

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await deleteUser({ userId });
      navigate("/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Delete User" />
        <p className="text-[var(--color-text-secondary)]">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Delete User" />
        <p className="text-[var(--color-danger)]">
          Error loading user: {error.message}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader title="Delete User" />
        <p className="text-[var(--color-danger)] mb-4">User not found.</p>
        <Button variant="secondary" onClick={handleCancel}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Delete User" />

      <Card className="max-w-2xl">
        <p className="text-lg text-[var(--color-text)] mb-4">
          Are you sure you want to delete the following user?
        </p>

        <div className="bg-[var(--color-bg-subtle)] p-4 rounded-md mb-6">
          <p className="mb-2 text-[var(--color-text)]">
            <span className="font-medium">Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p className="mb-2 text-[var(--color-text)]">
            <span className="font-medium">Registration number:</span>{" "}
            {user.registrationNumber || (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </p>
          <p className="mb-2 text-[var(--color-text)]">
            <span className="font-medium">Alternative registration number:</span>{" "}
            {user.alternativeRegistrationNumber || (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </p>
          <p className="text-[var(--color-text)]">
            <span className="font-medium">Commute distance:</span>{" "}
            {user.commuteDistance ?? (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </p>
        </div>

        <Alert variant="error" className="mb-6">
          This action cannot be undone.
        </Alert>

        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default DeleteUser;
