import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { useUrlQueryParams } from "../use-url-query-params";

describe("useUrlQueryParams", () => {
  it("obtiene un parámetro de la URL", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?foo=bar"]}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current.get("foo")).toBe("bar");
  });

  it("obtiene todos los valores de un parámetro", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?tag=a&tag=b"]}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current.getAll("tag")).toEqual(["a", "b"]);
  });

  it("actualiza un parámetro sin eliminar los demás", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?foo=bar&other=value"]}>
          {children}
        </MemoryRouter>
      ),
    });

    act(() => {
      result.current.set("foo", "updated");
    });

    expect(result.current.get("foo")).toBe("updated");
    expect(result.current.get("other")).toBe("value");
  });

  it("elimina un parámetro cuando recibe un valor vacío", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?foo=bar"]}>
          {children}
        </MemoryRouter>
      ),
    });

    act(() => {
      result.current.set("foo", "");
    });

    expect(result.current.get("foo")).toBeNull();
  });

  it("elimina un parámetro explícitamente", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?foo=bar&other=value"]}>
          {children}
        </MemoryRouter>
      ),
    });

    act(() => {
      result.current.remove("foo");
    });

    expect(result.current.get("foo")).toBeNull();
    expect(result.current.get("other")).toBe("value");
  });

  it("actualiza varios parámetros sin eliminar los demás", () => {
    const { result } = renderHook(() => useUrlQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?foo=bar&other=value"]}>
          {children}
        </MemoryRouter>
      ),
    });

    act(() => {
      result.current.setMany({
        foo: "updated",
        other: null,
        newParam: "new-value",
      });
    });

    expect(result.current.get("foo")).toBe("updated");
    expect(result.current.get("other")).toBeNull();
    expect(result.current.get("newParam")).toBe("new-value");
  });
});