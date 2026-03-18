import { screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { RegistrationNumbersContent } from "./RegistrationNumbersContent";

const makeRegistrationNumber = (overrides = {}) => ({
  registrationNumber: "AB12 CDE",
  name: "John Doe",
  ...overrides,
});

describe("RegistrationNumbersContent", () => {
  it("renders registration numbers in table rows", () => {
    const registrationNumbers = [
      makeRegistrationNumber(),
      makeRegistrationNumber({
        registrationNumber: "FG34 HIJ",
        name: "Jane Smith",
      }),
    ];

    renderWithProviders(
      <RegistrationNumbersContent registrationNumbers={registrationNumbers} />
    );

    const table = screen.getByRole("table", { name: "Registration Numbers" });
    const rows = within(table).getAllByRole("row");

    expect(rows).toHaveLength(3);

    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText("AB12 CDE")).toBeInTheDocument();
    expect(within(firstDataRow).getByText("John Doe")).toBeInTheDocument();

    const secondDataRow = rows[2];
    expect(within(secondDataRow).getByText("FG34 HIJ")).toBeInTheDocument();
    expect(within(secondDataRow).getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders empty table body when no results", () => {
    renderWithProviders(
      <RegistrationNumbersContent registrationNumbers={[]} />
    );

    const table = screen.getByRole("table", { name: "Registration Numbers" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(1);
  });
});
