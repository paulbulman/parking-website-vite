import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../hooks/api/queries/users";

function Users() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link
          to="/users/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left">First name</th>
              <th className="px-4 py-2 border-b text-left">Last name</th>
              <th className="px-4 py-2 border-b text-left">
                Registration number
              </th>
              <th className="px-4 py-2 border-b text-left">
                Alternative registration number
              </th>
              <th className="px-4 py-2 border-b text-left">Commute distance</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.firstName}</td>
                <td className="px-4 py-2 border-b">{user.lastName}</td>
                <td className="px-4 py-2 border-b">
                  {user.registrationNumber || "-"}
                </td>
                <td className="px-4 py-2 border-b">
                  {user.alternativeRegistrationNumber || "-"}
                </td>
                <td className="px-4 py-2 border-b">
                  {user.commuteDistance ?? "-"}
                </td>
                <td className="px-4 py-2 border-b">
                  <Link
                    to={`/users/edit/${user.userId}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    title="Edit user"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Link
                    to={`/users/delete/${user.userId}`}
                    className="text-red-600 hover:text-red-800"
                    title="Delete user"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
