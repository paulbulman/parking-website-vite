import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/useAuthContext";
import { SetPasswordContent } from "./SetPasswordContent";

function SetPasswordPage() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <SetPasswordContent from={from} />;
}

export default SetPasswordPage;
