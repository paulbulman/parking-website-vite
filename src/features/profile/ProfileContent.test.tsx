import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { ProfileContent } from "./ProfileContent";
import { useEditProfile } from "../../hooks/api/mutations/editProfile";

vi.mock("../../hooks/api/mutations/editProfile", () => ({
  useEditProfile: vi.fn(),
}));

const mockEditProfile = vi.fn();

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

describe("ProfileContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsTeamLeader = false;
    vi.mocked(useEditProfile).mockReturnValue({
      editProfile: mockEditProfile,
      isSaving: false,
      isError: false,
    });
  });

  it("initialises form fields from profile props", () => {
    renderWithProviders(<ProfileContent profile={profile} />);

    expect(screen.getByLabelText("Registration number")).toHaveValue("AB12 CDE");
    expect(screen.getByLabelText("Alternative registration number")).toHaveValue("FG34 HIJ");
    expect(screen.getByText("Requests reminder")).toBeInTheDocument();
  });

  it("calls editProfile with form data on submit", async () => {
    mockEditProfile.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ProfileContent profile={profile} />);

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

    renderWithProviders(<ProfileContent profile={profile} />);

    expect(screen.queryByText("Reservations reminder")).not.toBeInTheDocument();
  });

  it("shows reservations reminder for team leaders", () => {
    mockIsTeamLeader = true;

    renderWithProviders(<ProfileContent profile={profile} />);

    expect(screen.getByText("Reservations reminder")).toBeInTheDocument();
  });

  it("shows success message after save", async () => {
    mockEditProfile.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    renderWithProviders(<ProfileContent profile={profile} />);

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Profile saved successfully!")).toBeInTheDocument();
  });

  it("shows error message when save fails", async () => {
    mockEditProfile.mockRejectedValue(new Error("Network error"));
    vi.mocked(useEditProfile).mockReturnValue({
      editProfile: mockEditProfile,
      isSaving: false,
      isError: true,
    });

    renderWithProviders(<ProfileContent profile={profile} />);

    expect(screen.getByText("Failed to save profile. Please try again.")).toBeInTheDocument();
  });

  it("does not show error message when isError is false", async () => {
    renderWithProviders(<ProfileContent profile={profile} />);

    expect(screen.queryByText("Failed to save profile. Please try again.")).not.toBeInTheDocument();
  });

  it("initialises null registration numbers as empty strings", () => {
    const profileWithNulls = {
      ...profile,
      registrationNumber: null,
      alternativeRegistrationNumber: null,
    };

    renderWithProviders(<ProfileContent profile={profileWithNulls} />);

    expect(screen.getByLabelText("Registration number")).toHaveValue("");
    expect(screen.getByLabelText("Alternative registration number")).toHaveValue("");
  });

  it("sends empty registration numbers as null when saving", async () => {
    mockEditProfile.mockResolvedValue(undefined);
    const actor = userEvent.setup();

    const profileWithValues = {
      ...profile,
      registrationNumber: "AB12 CDE",
      alternativeRegistrationNumber: "FG34 HIJ",
    };

    renderWithProviders(<ProfileContent profile={profileWithValues} />);

    await actor.clear(screen.getByLabelText("Registration number"));
    await actor.clear(screen.getByLabelText("Alternative registration number"));

    await actor.click(screen.getByRole("button", { name: "Save" }));

    expect(mockEditProfile).toHaveBeenCalledWith({
      registrationNumber: null,
      alternativeRegistrationNumber: null,
      requestReminderEnabled: true,
      reservationReminderEnabled: false,
    });
  });

  it("toggles request reminder checkbox", async () => {
    const actor = userEvent.setup();

    renderWithProviders(<ProfileContent profile={profile} />);

    const checkbox = screen.getByRole("checkbox", { name: /requests reminder/i });
    expect(checkbox).toBeChecked();

    await actor.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it("disables save button and shows saving text while saving", () => {
    vi.mocked(useEditProfile).mockReturnValue({
      editProfile: mockEditProfile,
      isSaving: true,
      isError: false,
    });

    renderWithProviders(<ProfileContent profile={profile} />);

    const button = screen.getByRole("button", { name: "Saving..." });
    expect(button).toBeDisabled();
  });
});
