import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "../../hooks/api/mutations/deleteUser";
import { Button, Card, Alert } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type UsersData = components["schemas"]["UsersData"];

export function DeleteUserContent({
  user,
  userId,
}: {
  user: UsersData;
  userId: string;
}) {
  const navigate = useNavigate();
  const { deleteUser, isDeleting, isError } = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUser({ userId });
      navigate("/users");
    } catch {
      // Prevent navigation; error state is tracked by the mutation hook
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <Card className="max-w-2xl">
      <p className="text-lg text-[var(--color-text)] mb-4">
        Are you sure you want to delete the following user?
      </p>

      <dl className="bg-[var(--color-bg-subtle)] p-4 rounded-md mb-6 text-[var(--color-text)]">
        <div className="mb-2">
          <dt className="inline font-medium">Name:</dt>{" "}
          <dd className="inline">
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div className="mb-2">
          <dt className="inline font-medium">Registration number:</dt>{" "}
          <dd className="inline">
            {user.registrationNumber || (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </dd>
        </div>
        <div className="mb-2">
          <dt className="inline font-medium">
            Alternative registration number:
          </dt>{" "}
          <dd className="inline">
            {user.alternativeRegistrationNumber || (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium">Commute distance:</dt>{" "}
          <dd className="inline">
            {user.commuteDistance ?? (
              <span className="text-[var(--color-text-muted)]">-</span>
            )}
          </dd>
        </div>
      </dl>

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
        {isError && (
          <Alert variant="error" className="py-2">
            Failed to delete user. Please try again.
          </Alert>
        )}
      </div>
    </Card>
  );
}
