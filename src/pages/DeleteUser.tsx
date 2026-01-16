import { useNavigate, useParams } from "react-router";
import { useDeleteUser } from "../hooks/api/mutations/deleteUser";
import { useUsers } from "../hooks/api/queries/users";

function DeleteUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUsers();
  const { deleteUser, isDeleting } = useDeleteUser();

  const user = data?.users.find((u) => u.userId === userId);

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
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Delete User</h1>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Delete User</h1>
        <p className="text-red-600">Error loading user: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Delete User</h1>
        <p className="text-red-600">User not found.</p>
        <button
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4">Delete User</h1>
      <div className="bg-white border border-gray-300 rounded p-6 max-w-2xl">
        <p className="text-lg mb-4">
          Are you sure you want to delete the following user?
        </p>
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="mb-2">
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p className="mb-2">
            <strong>Registration number:</strong>{" "}
            {user.registrationNumber || "-"}
          </p>
          <p className="mb-2">
            <strong>Alternative registration number:</strong>{" "}
            {user.alternativeRegistrationNumber || "-"}
          </p>
          <p>
            <strong>Commute distance:</strong> {user.commuteDistance ?? "-"}
          </p>
        </div>
        <p className="text-red-600 font-semibold mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUser;
