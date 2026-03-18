import { screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { UsersContent } from "./UsersContent";

const makeUser = (overrides = {}) => ({
  userId: "user-1",
  firstName: "John",
  lastName: "Doe",
  registrationNumber: "AB12 CDE",
  alternativeRegistrationNumber: "FG34 HIJ",
  commuteDistance: 12.5,
  ...overrides,
});

describe("UsersContent", () => {
  it("renders user data in table rows", () => {
    const users = [
      makeUser(),
      makeUser({
        userId: "user-2",
        firstName: "Jane",
        lastName: "Smith",
        registrationNumber: "XY98 ZAB",
        alternativeRegistrationNumber: null,
        commuteDistance: null,
      }),
    ];

    renderWithProviders(<UsersContent users={users} />);

    const table = screen.getByRole("table", { name: "Users" });
    const rows = within(table).getAllByRole("row");

    expect(rows).toHaveLength(3);

    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText("John")).toBeInTheDocument();
    expect(within(firstDataRow).getByText("Doe")).toBeInTheDocument();
    expect(within(firstDataRow).getByText("AB12 CDE")).toBeInTheDocument();
    expect(within(firstDataRow).getByText("FG34 HIJ")).toBeInTheDocument();
    expect(within(firstDataRow).getByText("12.5")).toBeInTheDocument();

    const secondDataRow = rows[2];
    expect(within(secondDataRow).getByText("Jane")).toBeInTheDocument();
    expect(within(secondDataRow).getByText("Smith")).toBeInTheDocument();
    expect(within(secondDataRow).getByText("XY98 ZAB")).toBeInTheDocument();
  });

  it("renders edit and delete links with correct URLs", () => {
    renderWithProviders(<UsersContent users={[makeUser()]} />);

    const editLink = screen.getByRole("link", { name: "Edit John Doe" });
    expect(editLink).toHaveAttribute("href", "/users/edit/user-1");

    const deleteLink = screen.getByRole("link", { name: "Delete John Doe" });
    expect(deleteLink).toHaveAttribute("href", "/users/delete/user-1");
  });

  it("renders dash for missing optional fields", () => {
    renderWithProviders(
      <UsersContent
        users={[
          makeUser({
            registrationNumber: null,
            alternativeRegistrationNumber: null,
            commuteDistance: null,
          }),
        ]}
      />
    );

    const table = screen.getByRole("table", { name: "Users" });
    const dashes = within(table).getAllByText("-");
    expect(dashes).toHaveLength(3);
  });

  it("renders empty table body when no users", () => {
    renderWithProviders(<UsersContent users={[]} />);

    const table = screen.getByRole("table", { name: "Users" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(1);
  });
});
