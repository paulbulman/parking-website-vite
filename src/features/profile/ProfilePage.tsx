import { useProfile } from "../../hooks/api/queries/profile";
import { QueryPage } from "../../components/ui";
import { ProfileContent } from "./ProfileContent";

function ProfilePage() {
  return (
    <QueryPage title="Profile" query={useProfile()}>
      {(data) => <ProfileContent profile={data.profile} />}
    </QueryPage>
  );
}

export default ProfilePage;
