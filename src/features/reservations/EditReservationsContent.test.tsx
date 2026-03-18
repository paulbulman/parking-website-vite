import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { EditReservationsContent } from "./EditReservationsContent";

const mockEditReservations = vi.fn();

vi.mock("../../hooks/api/mutations/editReservations", () => ({
  useEditReservations: () => ({
    editReservations: mockEditReservations,
    isSaving: false,
  }),
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
  });

  it("renders reservation dropdowns", () => {
    renderWithProviders(<EditReservationsContent data={makeData()} />);

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  it("calls editReservations on save when selections change", async () => {
    mockEditReservations.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<EditReservationsContent data={makeData()} />);

    // Select from the first available dropdown (there are mobile + desktop versions)
    const selects = screen.getAllByRole("combobox");
    await actor.selectOptions(selects[1], "user-2");

    await actor.click(screen.getAllByRole("button", { name: "Save" })[0]);

    expect(mockEditReservations).toHaveBeenCalledWith({
      reservations: [
        { localDate: "2024-01-15", userIds: ["user-1", "user-2"] },
      ],
    });
  });

  it("shows success message after save", async () => {
    mockEditReservations.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<EditReservationsContent data={makeData()} />);

    const selects = screen.getAllByRole("combobox");
    await actor.selectOptions(selects[1], "user-2");

    await actor.click(screen.getAllByRole("button", { name: "Save" })[0]);

    expect(screen.getByText("Reservations saved successfully!")).toBeInTheDocument();
  });
});
