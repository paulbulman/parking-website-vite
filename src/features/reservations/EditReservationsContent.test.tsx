import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { EditReservationsContent } from "./EditReservationsContent";
import { useEditReservations } from "../../hooks/api/mutations/editReservations";

const mockEditReservations = vi.fn();

vi.mock("../../hooks/api/mutations/editReservations", () => ({
  useEditReservations: vi.fn(),
}));

const makeData = () => ({
  users: [
    { userId: "user-1", name: "Alice" },
    { userId: "user-2", name: "Bob" },
  ],
  shortLeadTimeSpaces: 2,
  reservations: {
    weeks: [
      {
        days: [
          {
            localDate: "2024-01-15",
            hidden: false,
            data: { userIds: ["user-1", ""] },
          },
        ],
      },
    ],
  },
});

describe("EditReservationsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditReservations).mockReturnValue({
      editReservations: mockEditReservations,
      isSaving: false,
      isError: false,
    });
  });

  it("renders reservation dropdowns for each slot", () => {
    renderWithProviders(<EditReservationsContent {...makeData()} />);

    expect(screen.getByRole("combobox", { name: /slot 1 for/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /slot 2 for/ })).toBeInTheDocument();
  });

  it("calls editReservations on save when selections change", async () => {
    mockEditReservations.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<EditReservationsContent {...makeData()} />);

    await actor.selectOptions(
      screen.getByRole("combobox", { name: /slot 2 for/ }),
      "user-2"
    );
    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditReservations).toHaveBeenCalledWith({
      reservations: [
        { localDate: "2024-01-15", userIds: ["user-1", "user-2"] },
      ],
    });
  });

  it("shows error message when save fails", () => {
    vi.mocked(useEditReservations).mockReturnValue({
      editReservations: mockEditReservations,
      isSaving: false,
      isError: true,
    });

    renderWithProviders(<EditReservationsContent {...makeData()} />);

    expect(screen.getByText("Failed to save reservations. Please try again.")).toBeInTheDocument();
  });

  it("shows success message after save", async () => {
    mockEditReservations.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<EditReservationsContent {...makeData()} />);

    await actor.selectOptions(
      screen.getByRole("combobox", { name: /slot 2 for/ }),
      "user-2"
    );
    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Reservations saved successfully!")).toBeInTheDocument();
  });
});
