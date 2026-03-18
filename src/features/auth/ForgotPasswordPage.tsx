import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/useAuthContext";
import { ForgotPasswordContent } from "./ForgotPasswordContent";

function ForgotPasswordPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <ForgotPasswordContent />;
}

export default ForgotPasswordPage;
