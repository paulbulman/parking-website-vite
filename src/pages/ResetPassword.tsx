import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { confirmResetPassword, signIn } from "aws-amplify/auth";
import { useAuthContext } from "../contexts/useAuthContext";
import { pwnedPassword } from "hibp";
import { Button, Input, Card, Alert } from "../components/ui";

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAuthStatus, isAuthenticated } = useAuthContext();

  const username = (location.state as { username?: string })?.username;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!username) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

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
      await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword,
      });

      await signIn({ username, password: newPassword });
      await refreshAuthStatus();

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Reset Password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Enter the code sent to your email and your new password.
          </p>
        </div>

        <Card elevated>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="code"
              label="Reset Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
            />

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
              {isLoading ? "Resetting password..." : "Reset Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
