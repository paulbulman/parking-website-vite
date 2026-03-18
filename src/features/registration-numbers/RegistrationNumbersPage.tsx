import { useState, type FormEvent } from "react";
import { useRegistrationNumbers } from "../../hooks/api/queries/registrationNumbers";
import { Button, Input, PageHeader } from "../../components/ui";
import { RegistrationNumbersContent } from "./RegistrationNumbersContent";

function RegistrationNumbersPage() {
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
          <RegistrationNumbersContent
            registrationNumbers={data.registrationNumbers}
          />
        )}
    </div>
  );
}

export default RegistrationNumbersPage;
