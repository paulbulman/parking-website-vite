import { useNavigate } from "react-router";
import { Button, Card } from "../components/ui";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card elevated className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-3">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          The page you're looking for doesn't exist. It may have been moved or
          deleted.
        </p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </Card>
    </div>
  );
}

export default NotFound;
