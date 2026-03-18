import type { components } from "../../hooks/api/types";

type RegistrationNumbersData =
  components["schemas"]["RegistrationNumbersData"];

export function RegistrationNumbersContent({
  registrationNumbers,
}: {
  registrationNumbers: RegistrationNumbersData[];
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full" aria-label="Registration Numbers">
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
            {registrationNumbers.map((item, index) => (
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
  );
}
