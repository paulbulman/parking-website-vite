import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { ForgotPasswordContent } from "./ForgotPasswordContent";

const mockResetPassword = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("aws-amplify/auth", () => ({
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
}));

describe("ForgotPasswordContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders username field", () => {
    renderWithProviders(<ForgotPasswordContent />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("navigates to reset-password with username on success", async () => {
    mockResetPassword.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ForgotPasswordContent />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.click(screen.getByRole("button", { name: "Send Reset Code" }));

    expect(mockResetPassword).toHaveBeenCalledWith({ username: "testuser" });
    expect(mockNavigate).toHaveBeenCalledWith("/reset-password", {
      state: { username: "testuser" },
    });
  });

  it("shows error message when reset fails", async () => {
    mockResetPassword.mockRejectedValue(new Error("User not found"));
    const actor = userEvent.setup();

    renderWithProviders(<ForgotPasswordContent />);

    await actor.type(screen.getByLabelText("Username"), "unknown");
    await actor.click(screen.getByRole("button", { name: "Send Reset Code" }));

    expect(screen.getByText("User not found")).toBeInTheDocument();
  });

  it("disables input and shows loading text during submission", async () => {
    let resolveReset: (value: unknown) => void;
    mockResetPassword.mockImplementation(
      () => new Promise((resolve) => { resolveReset = resolve; })
    );
    const actor = userEvent.setup();

    renderWithProviders(<ForgotPasswordContent />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.click(screen.getByRole("button", { name: "Send Reset Code" }));

    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sending code..." })).toBeDisabled();

    resolveReset!(undefined);
  });

  it("shows fallback error message for non-Error exceptions", async () => {
    mockResetPassword.mockRejectedValue("unexpected string error");
    const actor = userEvent.setup();

    renderWithProviders(<ForgotPasswordContent />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.click(screen.getByRole("button", { name: "Send Reset Code" }));

    expect(screen.getByText("Failed to request password reset")).toBeInTheDocument();
  });

  it("renders back to login link", () => {
    renderWithProviders(<ForgotPasswordContent />);

    expect(screen.getByRole("link", { name: "Back to Login" })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
