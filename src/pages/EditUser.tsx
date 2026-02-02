import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../hooks/api/queries/user";
import { useEditUser } from "../hooks/api/mutations/editUser";
import { Button, Input, Card, PageHeader } from "../components/ui";

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
      <div>
        <PageHeader title="Edit User" />
        <p className="text-[var(--color-text-secondary)]">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Edit User" />
        <p className="text-[var(--color-danger)]">
          Error loading user: {error.message}
        </p>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div>
        <PageHeader title="Edit User" />
        <p className="text-[var(--color-danger)] mb-4">User not found.</p>
        <Button variant="secondary" onClick={handleCancel}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit User" />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="firstName"
            label="First name"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />

          <Input
            id="lastName"
            label="Last name"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />

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

          <Input
            id="commuteDistance"
            label="Commute distance (mi)"
            type="number"
            step="0.1"
            value={formData.commuteDistance}
            onChange={(e) =>
              setFormData({ ...formData, commuteDistance: e.target.value })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditUser;
