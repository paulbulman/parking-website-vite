import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/api/mutations/addUser";
import { Button, Input, Card, Alert } from "../../components/ui";

export function AddUserContent() {
  const navigate = useNavigate();
  const { addUser, isSaving, isError } = useAddUser();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.emailAddress !== formData.confirmEmail) {
      setEmailError("Email addresses do not match");
      return;
    }

    setEmailError("");

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
    } catch {
      // Prevent navigation; error state is tracked by the mutation hook
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="emailAddress"
          label="Email"
          type="email"
          value={formData.emailAddress}
          onChange={(e) => {
            setFormData({ ...formData, emailAddress: e.target.value });
            setEmailError("");
          }}
          required
        />

        <Input
          id="confirmEmail"
          label="Confirm email"
          type="email"
          value={formData.confirmEmail}
          onChange={(e) => {
            setFormData({ ...formData, confirmEmail: e.target.value });
            setEmailError("");
          }}
          required
          error={emailError}
        />

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
            {isSaving ? "Adding..." : "Add User"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          {isError && (
            <Alert variant="error" className="py-2">
              Failed to add user. Please try again.
            </Alert>
          )}
        </div>
      </form>
    </Card>
  );
}
