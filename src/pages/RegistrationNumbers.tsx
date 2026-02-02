import { useState, type FormEvent } from "react";
import { useRegistrationNumbers } from "../hooks/api/queries/registrationNumbers";
import { Button, Input, PageHeader } from "../components/ui";

function RegistrationNumbers() {
  const [inputValue, setInputValue] = useState<string>("");
  const [submittedSearch, setSubmittedSearch] = useState<string>("");

  const { data, isLoading, error } = useRegistrationNumbers({
    searchString: submittedSearch,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(inputValue);
  };

  return (
    <div>
      <PageHeader title="Registration Numbers" />

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3 items-end max-w-lg">
          <div className="flex-grow">
            <Input
              id="search"
              label="Search Registration Number"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter registration number..."
            />
          </div>
          <Button type="submit" disabled={!inputValue.trim()}>
            Search
          </Button>
        </div>
      </form>

      {submittedSearch && isLoading && (
        <p className="text-[var(--color-text-secondary)]">Searching...</p>
      )}

      {submittedSearch && error && (
        <p className="text-[var(--color-danger)]">
          Error searching: {error.message}
        </p>
      )}

      {submittedSearch &&
        data?.registrationNumbers &&
        data.registrationNumbers.length === 0 && (
          <p className="text-[var(--color-text-secondary)]">
            No registration numbers found.
          </p>
        )}

      {submittedSearch &&
        data?.registrationNumbers &&
        data.registrationNumbers.length > 0 && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                      Registration Number
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                      Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.registrationNumbers.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-subtle)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--color-text)]">
                        {item.registrationNumber}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text)]">
                        {item.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

export default RegistrationNumbers;
