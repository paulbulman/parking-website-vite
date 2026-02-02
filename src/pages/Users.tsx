import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../hooks/api/queries/users";
import { Button, PageHeader } from "../components/ui";

function Users() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Users" />
        <p className="text-[var(--color-text-secondary)]">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Users" />
        <p className="text-[var(--color-danger)]">
          Error loading users: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users"
        action={
          <Link to="/users/add">
            <Button>Add User</Button>
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  First name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  Last name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  Registration number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  Alternative registration number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  Commute distance
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-subtle)] transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {user.registrationNumber || (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {user.alternativeRegistrationNumber || (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {user.commuteDistance ?? (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/users/edit/${user.userId}`}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mr-4"
                      title="Edit user"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      to={`/users/delete/${user.userId}`}
                      className="text-[var(--color-danger)] hover:opacity-75 transition-opacity"
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
    </div>
  );
}

export default Users;
