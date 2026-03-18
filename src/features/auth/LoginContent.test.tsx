import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { LoginContent } from "./LoginContent";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../contexts/useAuthContext", () => ({
  useAuthContext: () => ({
    login: mockLogin,
  }),
}));

describe("LoginContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders username and password fields", () => {
    renderWithProviders(<LoginContent from="/" />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("navigates to from path on successful login", async () => {
    mockLogin.mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: "DONE" } });
    const actor = userEvent.setup();

    renderWithProviders(<LoginContent from="/edit-requests" />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.type(screen.getByLabelText("Password"), "password123");
    await actor.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
    expect(mockNavigate).toHaveBeenCalledWith("/edit-requests", { replace: true });
  });

  it("navigates to set-password when new password required", async () => {
    mockLogin.mockResolvedValue({
      isSignedIn: false,
      nextStep: { signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" },
    });
    const actor = userEvent.setup();

    renderWithProviders(<LoginContent from="/profile" />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.type(screen.getByLabelText("Password"), "temppass");
    await actor.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockNavigate).toHaveBeenCalledWith("/set-password", {
      state: { from: "/profile" },
      replace: true,
    });
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockRejectedValue(new Error("Incorrect username or password"));
    const actor = userEvent.setup();

    renderWithProviders(<LoginContent from="/" />);

    await actor.type(screen.getByLabelText("Username"), "testuser");
    await actor.type(screen.getByLabelText("Password"), "wrong");
    await actor.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Incorrect username or password")).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    renderWithProviders(<LoginContent from="/" />);

    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });
});
