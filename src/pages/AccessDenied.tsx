import { useNavigate } from "react-router-dom";
import { Button, Card } from "../components/ui";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card elevated className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-3">
          Access Denied
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          You don't have permission to access this page. Please contact your
          manager if you believe you should have access.
        </p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </Card>
    </div>
  );
}

export default AccessDenied;
