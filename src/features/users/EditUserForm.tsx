import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useEditUser } from "../../hooks/api/mutations/editUser";
import { Button, Input, Card } from "../../components/ui";
import type { components } from "../../hooks/api/types";

type UsersData = components["schemas"]["UsersData"];

export function EditUserForm({ user, userId }: { user: UsersData; userId: string }) {
  const navigate = useNavigate();
  const { editUser } = useEditUser({ userId });

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    registrationNumber: user.registrationNumber ?? "",
    alternativeRegistrationNumber: user.alternativeRegistrationNumber ?? "",
    commuteDistance: user.commuteDistance?.toString() ?? "",
  });

  const [isSaving, setIsSaving] = useState(false);

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

  return (
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
  );
}
