import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { DeleteUserContent } from "./DeleteUserContent";
import { useDeleteUser } from "../../hooks/api/mutations/deleteUser";

const mockDeleteUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/api/mutations/deleteUser", () => ({
  useDeleteUser: vi.fn(),
}));

const user = {
  userId: "user-1",
  firstName: "John",
  lastName: "Doe",
  registrationNumber: "AB12 CDE",
  alternativeRegistrationNumber: "FG34 HIJ",
  commuteDistance: 12.5,
};

describe("DeleteUserContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isDeleting: false,
      isError: false,
    });
  });

  it("displays user details", () => {
    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText("AB12 CDE")).toBeInTheDocument();
    expect(screen.getByText("FG34 HIJ")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
  });

  it("calls deleteUser and navigates on delete", async () => {
    mockDeleteUser.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    await actor.click(screen.getByRole("button", { name: "Delete User" }));

    expect(mockDeleteUser).toHaveBeenCalledWith({ userId: "user-1" });
    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("navigates to users on cancel", async () => {
    const actor = userEvent.setup();

    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    await actor.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("shows warning that action cannot be undone", () => {
    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("displays dashes for null optional fields", () => {
    renderWithProviders(
      <DeleteUserContent
        user={{
          ...user,
          registrationNumber: null,
          alternativeRegistrationNumber: null,
          commuteDistance: null,
        }}
        userId="user-1"
      />
    );

    const dashes = screen.getAllByText("-");
    expect(dashes).toHaveLength(3);
  });

  it("disables buttons and shows deleting text while deleting", () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isDeleting: true,
      isError: false,
    });

    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("shows error message when delete fails", () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isDeleting: false,
      isError: true,
    });

    renderWithProviders(
      <DeleteUserContent user={user} userId="user-1" />
    );

    expect(screen.getByText("Failed to delete user. Please try again.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
