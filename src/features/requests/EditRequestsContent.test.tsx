import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { EditRequestsContent } from "./EditRequestsContent";
import { useEditRequests } from "../../hooks/api/mutations/editRequests";

const mockEditRequests = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/api/mutations/editRequests", () => ({
  useEditRequests: vi.fn(),
}));

const makeCalendarData = () => ({
  weeks: [
    {
      days: [
        {
          localDate: "2024-01-15",
          hidden: false,
          data: { requested: false },
        },
        {
          localDate: "2024-01-16",
          hidden: false,
          data: { requested: true },
        },
      ],
    },
  ],
});

describe("EditRequestsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditRequests).mockReturnValue({
      editRequests: mockEditRequests,
      isSaving: false,
      isError: false,
    });
  });

  it("renders checkboxes for each day", () => {
    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    expect(screen.getByRole("checkbox", { name: /15 Jan/ })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /16 Jan/ })).toBeInTheDocument();
  });

  it("calls editRequests with changed data on save", async () => {
    mockEditRequests.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    await actor.click(screen.getByRole("checkbox", { name: /15 Jan/ }));
    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditRequests).toHaveBeenCalledWith({
      requests: [{ localDate: "2024-01-15", requested: true }],
    });
  });

  it("shows error message when save fails", () => {
    vi.mocked(useEditRequests).mockReturnValue({
      editRequests: mockEditRequests,
      isSaving: false,
      isError: true,
    });

    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    expect(screen.getByText("Failed to save requests. Please try again.")).toBeInTheDocument();
  });

  it("navigates home on cancel", async () => {
    const actor = userEvent.setup();

    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    await actor.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/?week=0");
  });
});
