import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useChartTransition } from "./useChartTransition";

describe("useChartTransition", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("restarts the timer safely when triggered repeatedly", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useChartTransition(100));

    act(() => result.current[2]());
    expect(result.current[0]).toBe(true);

    act(() => vi.advanceTimersByTime(60));
    act(() => result.current[2]());
    act(() => vi.advanceTimersByTime(40));
    expect(result.current[0]).toBe(true);

    act(() => vi.advanceTimersByTime(60));
    expect(result.current[0]).toBe(false);
  });

  it("clears the pending timer on unmount", () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useChartTransition(100));

    act(() => result.current[2]());
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
