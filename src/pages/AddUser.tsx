import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAddUser } from "../hooks/api/mutations/addUser";

function AddUser() {
  const navigate = useNavigate();
  const { addUser } = useAddUser();

  const [formData, setFormData] = useState({
    emailAddress: "",
    confirmEmail: "",
    firstName: "",
    lastName: "",
    registrationNumber: "",
    alternativeRegistrationNumber: "",
    commuteDistance: "",
  });

  const [emailError, setEmailError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate emails match
    if (formData.emailAddress !== formData.confirmEmail) {
      setEmailError("Email addresses do not match");
      return;
    }

    setEmailError("");
    setIsSaving(true);

    try {
      await addUser({
        emailAddress: formData.emailAddress,
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
      console.error("Failed to add user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4">Add User</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded p-6 max-w-2xl"
      >
        <div className="mb-4">
          <label htmlFor="emailAddress" className="block font-semibold mb-2">
            Email
          </label>
          <input
            id="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => {
              setFormData({ ...formData, emailAddress: e.target.value });
              setEmailError("");
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmEmail" className="block font-semibold mb-2">
            Confirm email
          </label>
          <input
            id="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => {
              setFormData({ ...formData, confirmEmail: e.target.value });
              setEmailError("");
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

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
            {isSaving ? "Adding..." : "Add User"}
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

export default AddUser;
