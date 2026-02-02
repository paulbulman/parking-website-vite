import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { confirmSignIn } from "aws-amplify/auth";
import { useAuthContext } from "../contexts/useAuthContext";
import { pwnedPassword } from "hibp";
import { Button, Input, Card, Alert } from "../components/ui";

function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAuthStatus, isAuthenticated } = useAuthContext();

  const from = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const pwnedCount = await pwnedPassword(newPassword);
    if (pwnedCount > 0) {
      setError(
        "The password is known to have been compromised in a public data breach. Please choose a different password."
      );
      return;
    }

    setIsLoading(true);

    try {
      await confirmSignIn({ challengeResponse: newPassword });
      await refreshAuthStatus();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Set New Password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            You need to set a new password for your account.
          </p>
        </div>

        <Card elevated>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Setting password..." : "Set Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SetPassword;
