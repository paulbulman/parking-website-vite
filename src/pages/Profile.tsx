import { useState, type FormEvent } from "react";
import { useProfile } from "../hooks/api/queries/profile";
import { useEditProfile } from "../hooks/api/mutations/editProfile";
import { useUserClaims } from "../hooks/useUserClaims";
import { Button, Input, Card, PageHeader, Alert } from "../components/ui";

function Profile() {
  const { data, isLoading, error } = useProfile();
  const { editProfile, isSaving } = useEditProfile();
  const { isTeamLeader } = useUserClaims();

  const [formData, setFormData] = useState({
    registrationNumber: "",
    alternativeRegistrationNumber: "",
    requestReminderEnabled: false,
    reservationReminderEnabled: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    if (data?.profile) {
      setFormData({
        registrationNumber: data.profile.registrationNumber ?? "",
        alternativeRegistrationNumber:
          data.profile.alternativeRegistrationNumber ?? "",
        requestReminderEnabled: data.profile.requestReminderEnabled,
        reservationReminderEnabled: data.profile.reservationReminderEnabled,
      });
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      await editProfile({
        registrationNumber: formData.registrationNumber || null,
        alternativeRegistrationNumber:
          formData.alternativeRegistrationNumber || null,
        requestReminderEnabled: formData.requestReminderEnabled,
        reservationReminderEnabled: formData.reservationReminderEnabled,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Profile" />
        <p className="text-[var(--color-text-secondary)]">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Profile" />
        <p className="text-[var(--color-danger)]">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Profile" />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="registrationNumber"
            label="Registration number"
            type="text"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
          />

          <Input
            id="alternativeRegistrationNumber"
            label="Alternative registration number"
            type="text"
            value={formData.alternativeRegistrationNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                alternativeRegistrationNumber: e.target.value,
              })
            }
          />

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requestReminderEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requestReminderEnabled: e.target.checked,
                  })
                }
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium text-[var(--color-text)]">
                  Requests reminder
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Send me a reminder if I have no upcoming requests
                </div>
              </div>
            </label>

            {isTeamLeader() && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reservationReminderEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reservationReminderEnabled: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <div className="font-medium text-[var(--color-text)]">
                    Reservations reminder
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Send me a reminder if there are no day-ahead reservations
                  </div>
                </div>
              </label>
            )}
          </div>

          <div className="flex gap-4 items-center pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {saveSuccess && (
              <Alert variant="success" className="py-2">
                Profile saved successfully!
              </Alert>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Profile;
