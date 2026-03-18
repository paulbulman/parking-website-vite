import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { EditUserForm } from "./EditUserForm";

const mockEditUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/api/mutations/editUser", () => ({
  useEditUser: () => ({
    editUser: mockEditUser,
  }),
}));

const user = {
  userId: "user-1",
  firstName: "John",
  lastName: "Doe",
  registrationNumber: "AB12 CDE",
  alternativeRegistrationNumber: "FG34 HIJ",
  commuteDistance: 12.5,
};

describe("EditUserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initialises form fields from user props", () => {
    renderWithProviders(<EditUserForm user={user} userId="user-1" />);

    expect(screen.getByLabelText("First name")).toHaveValue("John");
    expect(screen.getByLabelText("Last name")).toHaveValue("Doe");
    expect(screen.getByLabelText("Registration number")).toHaveValue("AB12 CDE");
    expect(screen.getByLabelText("Alternative registration number")).toHaveValue("FG34 HIJ");
    expect(screen.getByLabelText("Commute distance (mi)")).toHaveValue(12.5);
  });

  it("calls editUser with form data on submit", async () => {
    mockEditUser.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<EditUserForm user={user} userId="user-1" />);

    await actor.clear(screen.getByLabelText("First name"));
    await actor.type(screen.getByLabelText("First name"), "Jane");

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditUser).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Doe",
      registrationNumber: "AB12 CDE",
      alternativeRegistrationNumber: "FG34 HIJ",
      commuteDistance: 12.5,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("navigates to users on cancel", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<EditUserForm user={user} userId="user-1" />);

    await actor.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("sends null for empty optional fields", async () => {
    mockEditUser.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <EditUserForm
        user={{
          ...user,
          registrationNumber: null,
          alternativeRegistrationNumber: null,
          commuteDistance: null,
        }}
        userId="user-1"
      />
    );

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditUser).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      registrationNumber: null,
      alternativeRegistrationNumber: null,
      commuteDistance: null,
    });
  });
});
