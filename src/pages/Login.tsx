import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuthContext } from "../contexts/useAuthContext";
import { Button, Input, Card, Alert } from "../components/ui";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(username, password);

      if (
        !response.isSignedIn &&
        response.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        navigate("/set-password", { state: { from }, replace: true });
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Login
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Please enter your credentials to log in.
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
              autoComplete="username"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
