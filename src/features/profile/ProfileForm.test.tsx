import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { ProfileForm } from "./ProfileForm";

const mockEditProfile = vi.fn();

vi.mock("../../hooks/api/mutations/editProfile", () => ({
  useEditProfile: () => ({
    editProfile: mockEditProfile,
    isSaving: false,
  }),
}));

let mockIsTeamLeader = false;

vi.mock("../../hooks/useUserClaims", () => ({
  useUserClaims: () => ({
    isTeamLeader: () => mockIsTeamLeader,
  }),
}));

const profile = {
  registrationNumber: "AB12 CDE",
  alternativeRegistrationNumber: "FG34 HIJ",
  requestReminderEnabled: true,
  reservationReminderEnabled: false,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsTeamLeader = false;
  });

  it("initialises form fields from profile props", () => {
    renderWithProviders(<ProfileForm profile={profile} />);

    expect(screen.getByLabelText("Registration number")).toHaveValue("AB12 CDE");
    expect(screen.getByLabelText("Alternative registration number")).toHaveValue("FG34 HIJ");
    expect(screen.getByText("Requests reminder")).toBeInTheDocument();
  });

  it("calls editProfile with form data on submit", async () => {
    mockEditProfile.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ProfileForm profile={profile} />);

    await actor.clear(screen.getByLabelText("Registration number"));
    await actor.type(screen.getByLabelText("Registration number"), "NEW REG");

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditProfile).toHaveBeenCalledWith({
      registrationNumber: "NEW REG",
      alternativeRegistrationNumber: "FG34 HIJ",
      requestReminderEnabled: true,
      reservationReminderEnabled: false,
    });
  });

  it("does not show reservations reminder for non-team-leaders", () => {
    mockIsTeamLeader = false;

    renderWithProviders(<ProfileForm profile={profile} />);

    expect(screen.queryByText("Reservations reminder")).not.toBeInTheDocument();
  });

  it("shows reservations reminder for team leaders", () => {
    mockIsTeamLeader = true;

    renderWithProviders(<ProfileForm profile={profile} />);

    expect(screen.getByText("Reservations reminder")).toBeInTheDocument();
  });

  it("shows success message after save", async () => {
    mockEditProfile.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ProfileForm profile={profile} />);

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Profile saved successfully!")).toBeInTheDocument();
  });
});
