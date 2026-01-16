import { useNavigate } from 'react-router-dom';

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your
          administrator if you believe you should have access.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default AccessDenied;
