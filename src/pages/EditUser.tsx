import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../hooks/api/queries/user";
import { useEditUser } from "../hooks/api/mutations/editUser";

function EditUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUser({ userId: userId ?? "" });
  const { editUser } = useEditUser({ userId: userId ?? "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    alternativeRegistrationNumber: "",
    commuteDistance: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.user) {
      setFormData({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        registrationNumber: data.user.registrationNumber ?? "",
        alternativeRegistrationNumber:
          data.user.alternativeRegistrationNumber ?? "",
        commuteDistance: data.user.commuteDistance?.toString() ?? "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await editUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        registrationNumber: formData.registrationNumber || null,
        alternativeRegistrationNumber:
          formData.alternativeRegistrationNumber || null,
        commuteDistance: formData.commuteDistance
          ? parseFloat(formData.commuteDistance)
          : null,
      });
      navigate("/users");
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit User</h1>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit User</h1>
        <p className="text-red-600">Error loading user: {error.message}</p>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Edit User</h1>
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
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded p-6 max-w-2xl"
      >
        <div className="mb-4">
          <label htmlFor="firstName" className="block font-semibold mb-2">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block font-semibold mb-2">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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

        <div className="mb-6">
          <label htmlFor="commuteDistance" className="block font-semibold mb-2">
            Commute distance (mi)
          </label>
          <input
            id="commuteDistance"
            type="number"
            step="0.1"
            value={formData.commuteDistance}
            onChange={(e) =>
              setFormData({ ...formData, commuteDistance: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
