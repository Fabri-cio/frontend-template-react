import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import EmptyState from "../EmptyState";

afterEach(() => {
  cleanup();
});

describe("EmptyState", () => {
  it("renderiza el título", () => {
    render(<EmptyState title="Sin registros" />);

    expect(screen.getByText("Sin registros")).toBeTruthy();
  });

  it("renderiza la descripción cuando existe", () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="No se encontraron registros."
      />,
    );

    expect(screen.getByText("No se encontraron registros.")).toBeTruthy();
  });

  it("no renderiza la descripción cuando no se proporciona", () => {
    render(<EmptyState title="Sin registros" />);

    expect(screen.queryByText("No se encontraron registros.")).toBeNull();
  });

  it("renderiza el icono personalizado", () => {
    render(
      <EmptyState
        title="Sin registros"
        icon={<span data-testid="custom-icon">ICON</span>}
      />,
    );

    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("renderiza una acción personalizada", () => {
    render(
      <EmptyState
        title="Sin registros"
        action={<button type="button">Crear registro</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Crear registro" })).toBeTruthy();
  });

  it("permite utilizar contenido React como título", () => {
    render(
      <EmptyState
        title={
          <>
            Sin <strong>usuarios</strong>
          </>
        }
      />,
    );

    expect(screen.getByText("usuarios")).toBeTruthy();
  });

  it("acepta atributos HTML adicionales", () => {
    render(
      <EmptyState
        title="Sin registros"
        data-testid="empty-state"
        aria-label="Estado vacío"
      />,
    );

    const element = screen.getByTestId("empty-state");

    expect(element.getAttribute("aria-label")).toBe("Estado vacío");
  });

  it("permite clases adicionales", () => {
    render(
      <EmptyState
        title="Sin registros"
        className="min-h-64"
        data-testid="empty-state"
      />,
    );

    expect(screen.getByTestId("empty-state").className).toContain("min-h-64");
  });
});
