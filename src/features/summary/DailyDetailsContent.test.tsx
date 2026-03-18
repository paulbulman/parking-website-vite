import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { DailyDetailsContent } from "./DailyDetailsContent";
import { useStayInterrupted } from "../../hooks/api/mutations/stayInterrupted";

const mockStayInterrupted = vi.fn();

vi.mock("../../hooks/api/mutations/stayInterrupted", () => ({
  useStayInterrupted: vi.fn(),
}));

const makeData = (overrides = {}) => ({
  details: [
    {
      localDate: "2024-01-15",
      hidden: false,
      data: {
        allocatedUsers: [{ name: "Alice", isHighlighted: false }],
        interruptedUsers: [{ name: "Bob", isHighlighted: true }],
        pendingUsers: [{ name: "Charlie", isHighlighted: false }],
        stayInterruptedStatus: { isAllowed: false, isSet: false },
        ...overrides,
      },
    },
  ],
});

describe("DailyDetailsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStayInterrupted).mockReturnValue({
      stayInterrupted: mockStayInterrupted,
      isSaving: false,
      isError: false,
    });
  });

  it("displays allocated users with count", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    expect(screen.getByText("Allocated (1)")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("displays interrupted users with count", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    expect(screen.getByText("Interrupted (1)")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("displays pending users with count", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    expect(screen.getByText("Pending (1)")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders date picker with Select Date label", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    expect(screen.getByLabelText("Select Date")).toBeInTheDocument();
  });

  it("renders highlighted user with semibold styling", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    const bob = screen.getByText("Bob");
    expect(bob.className).toContain("font-semibold");

    const alice = screen.getByText("Alice");
    expect(alice.className).not.toContain("font-semibold");
  });

  it("shows no requests message when there are no users", () => {
    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          allocatedUsers: [],
          interruptedUsers: [],
          pendingUsers: [],
        }).details}
        urlDate="2024-01-15"
      />
    );

    expect(
      screen.getByText("There are no requests for the selected date.")
    ).toBeInTheDocument();
  });

  it("shows stay interrupted button when allowed and not set", () => {
    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: false },
        }).details}
        urlDate="2024-01-15"
      />
    );

    expect(screen.getByRole("button", { name: "Stay interrupted" })).toBeInTheDocument();
  });

  it("shows re-request space button when stay interrupted is set", () => {
    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: true },
        }).details}
        urlDate="2024-01-15"
      />
    );

    expect(screen.getByRole("button", { name: "Re-request space" })).toBeInTheDocument();
  });

  it("calls stayInterrupted mutation when button is clicked", async () => {
    mockStayInterrupted.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: false },
        }).details}
        urlDate="2024-01-15"
      />
    );

    await actor.click(screen.getByRole("button", { name: "Stay interrupted" }));

    expect(mockStayInterrupted).toHaveBeenCalledWith({
      localDate: "2024-01-15",
      stayInterrupted: true,
    });
  });

  it("calls stayInterrupted with false when re-request space is clicked", async () => {
    mockStayInterrupted.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: true },
        }).details}
        urlDate="2024-01-15"
      />
    );

    await actor.click(screen.getByRole("button", { name: "Re-request space" }));

    expect(mockStayInterrupted).toHaveBeenCalledWith({
      localDate: "2024-01-15",
      stayInterrupted: false,
    });
  });

  it("does not show stay interrupted button when not allowed", () => {
    renderWithProviders(
      <DailyDetailsContent details={makeData().details} urlDate="2024-01-15" />
    );

    expect(screen.queryByRole("button", { name: "Stay interrupted" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Re-request space" })).not.toBeInTheDocument();
  });

  it("does not render section heading for empty category", () => {
    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          allocatedUsers: [],
        }).details}
        urlDate="2024-01-15"
      />
    );

    expect(screen.queryByText(/Allocated/)).not.toBeInTheDocument();
    expect(screen.getByText("Interrupted (1)")).toBeInTheDocument();
    expect(screen.getByText("Pending (1)")).toBeInTheDocument();
  });

  it("shows Saving text and disables button when saving", () => {
    vi.mocked(useStayInterrupted).mockReturnValue({
      stayInterrupted: mockStayInterrupted,
      isSaving: true,
      isError: false,
    });

    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: false },
        }).details}
        urlDate="2024-01-15"
      />
    );

    const button = screen.getByRole("button", { name: "Saving..." });
    expect(button).toBeDisabled();
  });

  it("shows error message when stay interrupted fails", () => {
    vi.mocked(useStayInterrupted).mockReturnValue({
      stayInterrupted: mockStayInterrupted,
      isSaving: false,
      isError: true,
    });

    renderWithProviders(
      <DailyDetailsContent
        details={makeData({
          stayInterruptedStatus: { isAllowed: true, isSet: false },
        }).details}
        urlDate="2024-01-15"
      />
    );

    expect(screen.getByText("Failed to update status. Please try again.")).toBeInTheDocument();
  });
});
