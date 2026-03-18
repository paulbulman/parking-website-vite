import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "../../test-utils";
import { HomeContent } from "./HomeContent";

const makeSummary = (weekCount = 2) => ({
  weeks: Array.from({ length: weekCount }, (_, weekIndex) => ({
    days: Array.from({ length: 5 }, (_, dayIndex) => ({
      localDate: `2024-01-${String(weekIndex * 7 + dayIndex + 15).padStart(2, "0")}`,
      hidden: false,
      data: { status: "allocated" as const, isProblem: false },
    })),
  })),
});

describe("HomeContent", () => {
  it("renders day links", () => {
    renderWithProviders(
      <HomeContent
        summary={makeSummary()}
        currentWeekIndex={0}
        onWeekChange={vi.fn()}
      />
    );

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("disables previous week button at first week", () => {
    renderWithProviders(
      <HomeContent
        summary={makeSummary()}
        currentWeekIndex={0}
        onWeekChange={vi.fn()}
      />
    );

    // Mobile nav has week navigation buttons
    const mobileNav = screen.getAllByRole("navigation", { name: "Weekly summary" })[0];
    const previousButton = within(mobileNav).getByRole("button", { name: "Previous week" });
    expect(previousButton).toBeDisabled();
  });

  it("disables next week button at last week", () => {
    renderWithProviders(
      <HomeContent
        summary={makeSummary(2)}
        currentWeekIndex={1}
        onWeekChange={vi.fn()}
      />
    );

    const mobileNav = screen.getAllByRole("navigation", { name: "Weekly summary" })[0];
    const nextButton = within(mobileNav).getByRole("button", { name: "Next week" });
    expect(nextButton).toBeDisabled();
  });

  it("calls onWeekChange when next week button is clicked", async () => {
    const onWeekChange = vi.fn();
    const actor = userEvent.setup();

    renderWithProviders(
      <HomeContent
        summary={makeSummary(3)}
        currentWeekIndex={0}
        onWeekChange={onWeekChange}
      />
    );

    const mobileNav = screen.getAllByRole("navigation", { name: "Weekly summary" })[0];
    const nextButton = within(mobileNav).getByRole("button", { name: "Next week" });
    await actor.click(nextButton);

    expect(onWeekChange).toHaveBeenCalledWith(1);
  });

  it("calls onWeekChange when previous week button is clicked", async () => {
    const onWeekChange = vi.fn();
    const actor = userEvent.setup();

    renderWithProviders(
      <HomeContent
        summary={makeSummary(3)}
        currentWeekIndex={1}
        onWeekChange={onWeekChange}
      />
    );

    const mobileNav = screen.getAllByRole("navigation", { name: "Weekly summary" })[0];
    const previousButton = within(mobileNav).getByRole("button", { name: "Previous week" });
    await actor.click(previousButton);

    expect(onWeekChange).toHaveBeenCalledWith(0);
  });
});
