import { useState, useEffect, FormEvent } from "react";
import { useProfile } from "../hooks/api/queries/profile";
import { useEditProfile } from "../hooks/api/mutations/editProfile";
import { useUserClaims } from "../hooks/useUserClaims";

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

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        registrationNumber: data.profile.registrationNumber ?? "",
        alternativeRegistrationNumber:
          data.profile.alternativeRegistrationNumber ?? "",
        requestReminderEnabled: data.profile.requestReminderEnabled,
        reservationReminderEnabled: data.profile.reservationReminderEnabled,
      });
    }
  }, [data]);

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
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-red-600">Error loading profile: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded p-6 max-w-2xl"
      >
        <div className="mb-4">
          <label
            htmlFor="registrationNumber"
            className="block font-semibold mb-2"
          >
            Registration number
          </label>
          <input
            id="registrationNumber"
            type="text"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="alternativeRegistrationNumber"
            className="block font-semibold mb-2"
          >
            Alternative registration number
          </label>
          <input
            id="alternativeRegistrationNumber"
            type="text"
            value={formData.alternativeRegistrationNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                alternativeRegistrationNumber: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.requestReminderEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requestReminderEnabled: e.target.checked,
                })
              }
              className="mt-1"
            />
            <div>
              <div className="font-semibold">Requests reminder</div>
              <div className="text-sm text-gray-600">
                Send me a reminder if I have no upcoming requests
              </div>
            </div>
          </label>
        </div>

        {isTeamLeader() && (
          <div className="mb-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.reservationReminderEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservationReminderEnabled: e.target.checked,
                  })
                }
                className="mt-1"
              />
              <div>
                <div className="font-semibold">Reservations reminder</div>
                <div className="text-sm text-gray-600">
                  Send me a reminder if there are no day-ahead reservations
                </div>
              </div>
            </label>
          </div>
        )}

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {saveSuccess && (
            <span className="text-green-600 font-semibold">
              Profile saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
