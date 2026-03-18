import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalendarChanges } from "./useCalendarChanges";

describe("useCalendarChanges", () => {
  it("returns initial values in merged when no changes exist", () => {
    const initialValues = {
      "2024-01-15": true,
      "2024-01-16": false,
    };

    const { result } = renderHook(() => useCalendarChanges(initialValues));

    expect(result.current.merged).toEqual({
      "2024-01-15": true,
      "2024-01-16": false,
    });
    expect(result.current.changes).toEqual({});
  });

  it("update adds a change that appears in merged", () => {
    const initialValues = {
      "2024-01-15": false,
    };

    const { result } = renderHook(() => useCalendarChanges(initialValues));

    act(() => {
      result.current.update("2024-01-15", true);
    });

    expect(result.current.merged).toEqual({ "2024-01-15": true });
    expect(result.current.changes).toEqual({ "2024-01-15": true });
  });

  it("changes only tracks modified entries", () => {
    const initialValues = {
      "2024-01-15": false,
      "2024-01-16": false,
      "2024-01-17": false,
    };

    const { result } = renderHook(() => useCalendarChanges(initialValues));

    act(() => {
      result.current.update("2024-01-15", true);
      result.current.update("2024-01-17", true);
    });

    expect(result.current.changes).toEqual({
      "2024-01-15": true,
      "2024-01-17": true,
    });
    expect(result.current.merged).toEqual({
      "2024-01-15": true,
      "2024-01-16": false,
      "2024-01-17": true,
    });
  });

  it("reset clears all changes and reverts merged to initial values", () => {
    const initialValues = {
      "2024-01-15": false,
      "2024-01-16": false,
    };

    const { result } = renderHook(() => useCalendarChanges(initialValues));

    act(() => {
      result.current.update("2024-01-15", true);
      result.current.update("2024-01-16", true);
    });

    expect(result.current.changes).toEqual({
      "2024-01-15": true,
      "2024-01-16": true,
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.changes).toEqual({});
    expect(result.current.merged).toEqual(initialValues);
  });

  it("toggling a value back to its original still appears in changes", () => {
    const initialValues = {
      "2024-01-15": false,
    };

    const { result } = renderHook(() => useCalendarChanges(initialValues));

    act(() => {
      result.current.update("2024-01-15", true);
    });

    act(() => {
      result.current.update("2024-01-15", false);
    });

    expect(result.current.changes).toEqual({ "2024-01-15": false });
    expect(result.current.merged).toEqual({ "2024-01-15": false });
  });
});
