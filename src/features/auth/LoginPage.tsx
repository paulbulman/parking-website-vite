import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/useAuthContext";
import { LoginContent } from "./LoginContent";

function LoginPage() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <LoginContent from={from} />;
}

export default LoginPage;
