import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToastProvider } from "./ToastProvider";
import { useToast } from "./useToast";

describe("useToast", () => {
  it("funciona dentro de ToastProvider", () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    expect(result.current.showToast).toEqual(expect.any(Function));
    expect(result.current.dismissToast).toEqual(expect.any(Function));
  });

  it("lanza un error cuando se utiliza fuera de ToastProvider", () => {
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast debe utilizarse dentro de un ToastProvider.",
    );
  });
});
