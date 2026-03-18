import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { ResetPasswordContent } from "./ResetPasswordContent";

const mockConfirmResetPassword = vi.fn();
const mockSignIn = vi.fn();
const mockPwnedPassword = vi.fn();
const mockRefreshAuthStatus = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("aws-amplify/auth", () => ({
  confirmResetPassword: (...args: unknown[]) => mockConfirmResetPassword(...args),
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

vi.mock("hibp", () => ({
  pwnedPassword: (...args: unknown[]) => mockPwnedPassword(...args),
}));

vi.mock("../../contexts/useAuthContext", () => ({
  useAuthContext: () => ({
    refreshAuthStatus: mockRefreshAuthStatus,
  }),
}));

describe("ResetPasswordContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPwnedPassword.mockResolvedValue(0);
    mockRefreshAuthStatus.mockResolvedValue(undefined);
  });

  it("renders code and password fields", () => {
    renderWithProviders(<ResetPasswordContent username="testuser" />);

    expect(screen.getByLabelText("Reset Code")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "password1");
    await actor.type(screen.getByLabelText("Confirm Password"), "password2");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(mockConfirmResetPassword).not.toHaveBeenCalled();
  });

  it("shows error for compromised password", async () => {
    mockPwnedPassword.mockResolvedValue(3);
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "compromised");
    await actor.type(screen.getByLabelText("Confirm Password"), "compromised");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      screen.getByText(/known to have been compromised/)
    ).toBeInTheDocument();
    expect(mockConfirmResetPassword).not.toHaveBeenCalled();
  });

  it("resets password and signs in on success", async () => {
    mockConfirmResetPassword.mockResolvedValue(undefined);
    mockSignIn.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(mockConfirmResetPassword).toHaveBeenCalledWith({
      username: "testuser",
      confirmationCode: "123456",
      newPassword: "newpass123",
    });
    expect(mockSignIn).toHaveBeenCalledWith({
      username: "testuser",
      password: "newpass123",
    });
    expect(mockRefreshAuthStatus).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("disables inputs and shows loading text during submission", async () => {
    let resolveReset: (value: unknown) => void;
    mockConfirmResetPassword.mockImplementation(
      () => new Promise((resolve) => { resolveReset = resolve; })
    );
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByLabelText("Reset Code")).toBeDisabled();
    expect(screen.getByLabelText("New Password")).toBeDisabled();
    expect(screen.getByLabelText("Confirm Password")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Resetting password..." })).toBeDisabled();

    resolveReset!(undefined);
  });

  it("shows error when auto sign-in fails after reset", async () => {
    mockConfirmResetPassword.mockResolvedValue(undefined);
    mockSignIn.mockRejectedValue(new Error("Auto sign-in failed"));
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText("Auto sign-in failed")).toBeInTheDocument();
  });

  it("shows fallback error message for non-Error exceptions", async () => {
    mockConfirmResetPassword.mockRejectedValue("unexpected string error");
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "123456");
    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText("Failed to reset password")).toBeInTheDocument();
  });

  it("shows error when reset fails", async () => {
    mockConfirmResetPassword.mockRejectedValue(new Error("Invalid code"));
    const actor = userEvent.setup();

    renderWithProviders(<ResetPasswordContent username="testuser" />);

    await actor.type(screen.getByLabelText("Reset Code"), "000000");
    await actor.type(screen.getByLabelText("New Password"), "newpass123");
    await actor.type(screen.getByLabelText("Confirm Password"), "newpass123");
    await actor.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText("Invalid code")).toBeInTheDocument();
  });
});
