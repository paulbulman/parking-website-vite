import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { AddUserContent } from "./AddUserContent";
import { useAddUser } from "../../hooks/api/mutations/addUser";

const mockAddUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/api/mutations/addUser", () => ({
  useAddUser: vi.fn(),
}));

describe("AddUserContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddUser).mockReturnValue({
      addUser: mockAddUser,
      isSaving: false,
      isError: false,
    });
  });

  it("renders empty form fields", () => {
    renderWithProviders(<AddUserContent />);

    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Confirm email")).toHaveValue("");
    expect(screen.getByLabelText("First name")).toHaveValue("");
    expect(screen.getByLabelText("Last name")).toHaveValue("");
    expect(screen.getByLabelText("Registration number")).toHaveValue("");
    expect(screen.getByLabelText("Alternative registration number")).toHaveValue("");
    expect(screen.getByLabelText("Commute distance (mi)")).toHaveValue(null);
  });

  it("calls addUser with form data on submit", async () => {
    mockAddUser.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<AddUserContent />);

    await actor.type(screen.getByLabelText("Email"), "test@example.com");
    await actor.type(screen.getByLabelText("Confirm email"), "test@example.com");
    await actor.type(screen.getByLabelText("First name"), "Jane");
    await actor.type(screen.getByLabelText("Last name"), "Smith");
    await actor.type(screen.getByLabelText("Registration number"), "AB12 CDE");
    await actor.type(screen.getByLabelText("Alternative registration number"), "FG34 HIJ");
    await actor.type(screen.getByLabelText("Commute distance (mi)"), "15.5");

    await actor.click(screen.getByRole("button", { name: "Add User" }));

    expect(mockAddUser).toHaveBeenCalledWith({
      emailAddress: "test@example.com",
      firstName: "Jane",
      lastName: "Smith",
      registrationNumber: "AB12 CDE",
      alternativeRegistrationNumber: "FG34 HIJ",
      commuteDistance: 15.5,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("navigates to users on cancel", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<AddUserContent />);

    await actor.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("sends null for empty optional fields", async () => {
    mockAddUser.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<AddUserContent />);

    await actor.type(screen.getByLabelText("Email"), "test@example.com");
    await actor.type(screen.getByLabelText("Confirm email"), "test@example.com");
    await actor.type(screen.getByLabelText("First name"), "Jane");
    await actor.type(screen.getByLabelText("Last name"), "Smith");

    await actor.click(screen.getByRole("button", { name: "Add User" }));

    expect(mockAddUser).toHaveBeenCalledWith({
      emailAddress: "test@example.com",
      firstName: "Jane",
      lastName: "Smith",
      registrationNumber: null,
      alternativeRegistrationNumber: null,
      commuteDistance: null,
    });
  });

  it("shows error when email addresses do not match", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<AddUserContent />);

    await actor.type(screen.getByLabelText("Email"), "test@example.com");
    await actor.type(screen.getByLabelText("Confirm email"), "other@example.com");
    await actor.type(screen.getByLabelText("First name"), "Jane");
    await actor.type(screen.getByLabelText("Last name"), "Smith");

    await actor.click(screen.getByRole("button", { name: "Add User" }));

    expect(screen.getByText("Email addresses do not match")).toBeInTheDocument();
    expect(mockAddUser).not.toHaveBeenCalled();
  });

  it("clears email error when user edits email fields", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<AddUserContent />);

    await actor.type(screen.getByLabelText("Email"), "test@example.com");
    await actor.type(screen.getByLabelText("Confirm email"), "other@example.com");
    await actor.type(screen.getByLabelText("First name"), "Jane");
    await actor.type(screen.getByLabelText("Last name"), "Smith");

    await actor.click(screen.getByRole("button", { name: "Add User" }));

    expect(screen.getByText("Email addresses do not match")).toBeInTheDocument();

    await actor.type(screen.getByLabelText("Confirm email"), "x");

    expect(screen.queryByText("Email addresses do not match")).not.toBeInTheDocument();
  });

  it("shows error message when save fails", () => {
    vi.mocked(useAddUser).mockReturnValue({
      addUser: mockAddUser,
      isSaving: false,
      isError: true,
    });

    renderWithProviders(<AddUserContent />);

    expect(screen.getByText("Failed to add user. Please try again.")).toBeInTheDocument();
  });
});
