import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { resetPassword } from "aws-amplify/auth";
import { Link } from "react-router";
import { useAuthContext } from "../contexts/useAuthContext";
import { Button, Input, Card, Alert } from "../components/ui";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword({ username });
      navigate("/reset-password", { state: { username } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request password reset"
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
            Forgot Password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Enter your username and we'll send you a code to reset your password.
          </p>
        </div>

        <Card elevated>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Sending code..." : "Send Reset Code"}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
