import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { SetPasswordContent } from "./SetPasswordContent";

const mockConfirmSignIn = vi.fn();
const mockPwnedPassword = vi.fn();
const mockRefreshAuthStatus = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("aws-amplify/auth", () => ({
  confirmSignIn: (...args: unknown[]) => mockConfirmSignIn(...args),
}));

vi.mock("hibp", () => ({
  pwnedPassword: (...args: unknown[]) => mockPwnedPassword(...args),
}));

vi.mock("../../contexts/useAuthContext", () => ({
  useAuthContext: () => ({
    refreshAuthStatus: mockRefreshAuthStatus,
  }),
}));

describe("SetPasswordContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPwnedPassword.mockResolvedValue(0);
    mockRefreshAuthStatus.mockResolvedValue(undefined);
  });

  it("renders password fields", () => {
    renderWithProviders(<SetPasswordContent from="/" />);

    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<SetPasswordContent from="/" />);

    await actor.type(screen.getByLabelText("New Password"), "password1");
    await actor.type(screen.getByLabelText("Confirm Password"), "password2");
    await actor.click(screen.getByRole("button", { name: "Set Password" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(mockConfirmSignIn).not.toHaveBeenCalled();
  });

  it("shows error for compromised password", async () => {
    mockPwnedPassword.mockResolvedValue(5);
    const actor = userEvent.setup();

    renderWithProviders(<SetPasswordContent from="/" />);

    await actor.type(screen.getByLabelText("New Password"), "compromised");
    await actor.type(screen.getByLabelText("Confirm Password"), "compromised");
    await actor.click(screen.getByRole("button", { name: "Set Password" }));

    expect(
      screen.getByText(/known to have been compromised/)
    ).toBeInTheDocument();
    expect(mockConfirmSignIn).not.toHaveBeenCalled();
  });

  it("navigates to from path on success", async () => {
    mockConfirmSignIn.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<SetPasswordContent from="/profile" />);

    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Set Password" }));

    expect(mockConfirmSignIn).toHaveBeenCalledWith({
      challengeResponse: "newpass123",
    });
    expect(mockRefreshAuthStatus).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/profile", { replace: true });
  });

  it("shows error when confirmSignIn fails", async () => {
    mockConfirmSignIn.mockRejectedValue(new Error("Invalid password format"));
    const actor = userEvent.setup();

    renderWithProviders(<SetPasswordContent from="/" />);

    await actor.type(screen.getByLabelText("New Password"), "short");
    await actor.type(screen.getByLabelText("Confirm Password"), "short");
    await actor.click(screen.getByRole("button", { name: "Set Password" }));

    expect(screen.getByText("Invalid password format")).toBeInTheDocument();
  });
});
