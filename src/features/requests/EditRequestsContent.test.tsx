import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { EditRequestsContent } from "./EditRequestsContent";

const mockEditRequests = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/api/mutations/editRequests", () => ({
  useEditRequests: () => ({
    editRequests: mockEditRequests,
    isSaving: false,
  }),
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
  });

  it("renders checkboxes matching initial request state", () => {
    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("calls editRequests with changed data on save", async () => {
    mockEditRequests.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    // Click the first unchecked checkbox (there are mobile + desktop versions)
    const checkboxes = screen.getAllByRole("checkbox");
    await actor.click(checkboxes[0]);

    // Click the first Save button
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    await actor.click(saveButtons[0]);

    expect(mockEditRequests).toHaveBeenCalledWith({
      requests: [{ localDate: "2024-01-15", requested: true }],
    });
  });

  it("navigates home on cancel", async () => {
    const actor = userEvent.setup();

    renderWithProviders(
      <EditRequestsContent requests={makeCalendarData()} initialWeekIndex={0} />
    );

    const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
    await actor.click(cancelButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/?week=0");
  });
});
