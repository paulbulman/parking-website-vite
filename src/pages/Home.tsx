import { useSummary } from '../hooks/useSummary';

function Home() {
  const { data, isLoading, error } = useSummary();

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <p>Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <p className="text-red-600">Error loading summary data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Parking Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-gray-600 text-sm font-medium uppercase mb-2">Available Spaces</h2>
          <p className="text-4xl font-bold text-blue-600">
            {data?.availableSpaces} <span className="text-xl text-gray-400">/ {data?.totalSpaces}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-gray-600 text-sm font-medium uppercase mb-2">Active Reservations</h2>
          <p className="text-4xl font-bold text-green-600">{data?.activeReservations}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-gray-600 text-sm font-medium uppercase mb-2">Pending Requests</h2>
          <p className="text-4xl font-bold text-orange-600">{data?.pendingRequests}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-gray-600 text-sm font-medium uppercase mb-2">Registered Users</h2>
          <p className="text-4xl font-bold text-purple-600">{data?.registeredUsers}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
