import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { OverrideRequestsContent } from "./OverrideRequestsContent";
import { useEditUserRequests } from "../../hooks/api/mutations/editUserRequests";

const mockNavigate = vi.fn();
const mockEditUserRequests = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

const mockUseUserRequests = vi.fn();

vi.mock("../../hooks/api/queries/userRequests", () => ({
  useUserRequests: (...args: unknown[]) => mockUseUserRequests(...args),
}));

vi.mock("../../hooks/api/mutations/editUserRequests", () => ({
  useEditUserRequests: vi.fn(),
}));

const users = [
  { userId: "user-1", name: "Alice" },
  { userId: "user-2", name: "Bob" },
];

describe("OverrideRequestsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserRequests.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    vi.mocked(useEditUserRequests).mockReturnValue({
      editUserRequests: mockEditUserRequests,
      isSaving: false,
      isError: false,
    });
  });

  it("renders user selector with users", () => {
    renderWithProviders(<OverrideRequestsContent users={users} />);

    expect(screen.getByLabelText("Select User")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows prompt when no user is selected", () => {
    renderWithProviders(<OverrideRequestsContent users={users} />);

    expect(
      screen.getByText("Please select a user to update their requests.")
    ).toBeInTheDocument();
  });

  it("allows selecting a user", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<OverrideRequestsContent users={users} />);

    await actor.selectOptions(screen.getByLabelText("Select User"), "user-1");

    expect(screen.getByLabelText("Select User")).toHaveValue("user-1");
  });

  it("renders component without a selected user", () => {
    renderWithProviders(<OverrideRequestsContent users={users} />);

    expect(screen.getByLabelText("Select User")).toBeInTheDocument();
  });

  it("does not show Save and Cancel buttons when no user is selected", () => {
    renderWithProviders(<OverrideRequestsContent users={users} />);

    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });

  it("navigates home on cancel", async () => {
    mockUseUserRequests.mockReturnValue({
      data: {
        requests: {
          weeks: [
            {
              days: [
                {
                  localDate: "2024-01-15",
                  hidden: false,
                  data: { requested: false },
                },
              ],
            },
          ],
        },
      },
      isLoading: false,
      error: null,
    });

    const actor = userEvent.setup();

    renderWithProviders(<OverrideRequestsContent users={users} />);

    await actor.selectOptions(screen.getByLabelText("Select User"), "user-1");
    await actor.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
