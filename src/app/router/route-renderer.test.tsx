import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { RouteRenderer } from "./route-renderer";
import type { AppRoute } from "./route.types";

describe("RouteRenderer", () => {
  it("renderiza una ruta normal", () => {
    const routes: AppRoute[] = [
      {
        path: "/",
        element: <div>Home</div>,
      },
    ];

    render(
      <MemoryRouter initialEntries={["/"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeDefined();
  });

  it("renderiza una ruta wildcard cuando no existe coincidencia", () => {
    const routes: AppRoute[] = [
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "*",
        element: <div>Not Found</div>,
      },
    ];

    render(
      <MemoryRouter initialEntries={["/ruta-inexistente"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Not Found")).toBeDefined();
  });
});
