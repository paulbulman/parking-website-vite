import { useProfile } from "../../hooks/api/queries/profile";
import { QueryPage } from "../../components/ui";
import { ProfileForm } from "./ProfileForm";

function ProfilePage() {
  return (
    <QueryPage title="Profile" query={useProfile()}>
      {(data) => <ProfileForm profile={data.profile} />}
    </QueryPage>
  );
}

export default ProfilePage;
