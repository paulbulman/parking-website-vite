import { useState, type FormEvent } from "react";
import { useRegistrationNumbers } from "../hooks/api/queries/registrationNumbers";

function RegistrationNumbers() {
  const [inputValue, setInputValue] = useState<string>("");
  const [submittedSearch, setSubmittedSearch] = useState<string>("");

  const { data, isLoading, error } = useRegistrationNumbers({ searchString: submittedSearch });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(inputValue);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Registration Numbers</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search Registration Number
        </label>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter registration number..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px]"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!inputValue.trim()}
          >
            Search
          </button>
        </div>
      </form>

      {submittedSearch && isLoading && (
        <p>Searching...</p>
      )}

      {submittedSearch && error && (
        <p className="text-red-600">Error searching: {error.message}</p>
      )}

      {submittedSearch && data?.registrationNumbers && data.registrationNumbers.length === 0 && (
        <p className="text-gray-600">No registration numbers found.</p>
      )}

      {submittedSearch && data?.registrationNumbers && data.registrationNumbers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Registration Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {data.registrationNumbers.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.registrationNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RegistrationNumbers;
