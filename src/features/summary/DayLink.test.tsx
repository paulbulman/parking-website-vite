import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { DayLink } from "./DayLink";

const makeDay = (overrides = {}) => ({
  localDate: "2024-01-15",
  hidden: false,
  data: {
    status: "allocated" as const,
    isProblem: false,
  },
  ...overrides,
});

describe("DayLink", () => {
  it("renders link to daily details with correct href", () => {
    renderWithProviders(<DayLink day={makeDay()} variant="desktop" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/daily-details/2024-01-15");
  });

  it("displays allocated status text", () => {
    renderWithProviders(<DayLink day={makeDay()} variant="desktop" />);

    expect(screen.getByText("Allocated")).toBeInTheDocument();
  });

  it("displays pending status text", () => {
    renderWithProviders(
      <DayLink day={makeDay({ data: { status: "pending" } })} variant="desktop" />
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("displays interrupted status text", () => {
    renderWithProviders(
      <DayLink day={makeDay({ data: { status: "interrupted" } })} variant="desktop" />
    );

    expect(screen.getByText("Interrupted")).toBeInTheDocument();
  });

  it("includes accessible name with day and status", () => {
    renderWithProviders(<DayLink day={makeDay()} variant="desktop" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(/Monday 15 Jan, Allocated/);
  });

  it("marks link as problem when isProblem is true", () => {
    renderWithProviders(
      <DayLink
        day={makeDay({ data: { status: "allocated" as const, isProblem: true } })}
        variant="desktop"
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-problem", "true");
  });

  it("does not mark link as problem when isProblem is false", () => {
    renderWithProviders(<DayLink day={makeDay()} variant="desktop" />);

    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("data-problem");
  });

  it("displays null status as dash with No status accessible label", () => {
    renderWithProviders(
      <DayLink day={makeDay({ data: { status: null } })} variant="desktop" />
    );

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName(/No status/);
  });

  it("displays hardInterrupted status as Interrupted", () => {
    renderWithProviders(
      <DayLink day={makeDay({ data: { status: "hardInterrupted" } })} variant="desktop" />
    );

    expect(screen.getByText("Interrupted")).toBeInTheDocument();
  });

  it("renders mobile variant", () => {
    renderWithProviders(<DayLink day={makeDay()} variant="mobile" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/daily-details/2024-01-15");
    expect(screen.getByText("Allocated")).toBeInTheDocument();
  });
});
