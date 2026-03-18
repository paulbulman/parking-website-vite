import { Link } from "react-router";
import { useUsers } from "../../hooks/api/queries/users";
import { Button, QueryPage } from "../../components/ui";
import { UsersContent } from "./UsersContent";

function UsersPage() {
  return (
    <QueryPage
      title="Users"
      query={useUsers()}
      action={
        <Link to="/users/add">
          <Button>Add User</Button>
        </Link>
      }
    >
      {(data) => <UsersContent users={data.users} />}
    </QueryPage>
  );
}

export default UsersPage;
