import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🤷</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist. It may have been moved or
          deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
