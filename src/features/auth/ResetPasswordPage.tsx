import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/useAuthContext";
import { ResetPasswordContent } from "./ResetPasswordContent";

function ResetPasswordPage() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  const username = (location.state as { username?: string })?.username;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!username) {
    return <Navigate to="/forgot-password" replace />;
  }

  return <ResetPasswordContent username={username} />;
}

export default ResetPasswordPage;
