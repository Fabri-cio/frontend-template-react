import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("renderiza el spinner", () => {
    render(<LoadingState />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renderiza el mensaje cuando se proporciona", () => {
    render(<LoadingState message="Cargando información..." />);

    expect(screen.getByText("Cargando información...")).toBeInTheDocument();
  });

  it("no renderiza mensaje cuando no se proporciona", () => {
    render(<LoadingState />);

    expect(
      screen.queryByText("Cargando información..."),
    ).not.toBeInTheDocument();
  });

  it("permite usar contenido React como mensaje", () => {
    render(
      <LoadingState
        message={
          <>
            Cargando <strong>datos</strong>
          </>
        }
      />,
    );

    expect(screen.getByText("datos")).toBeInTheDocument();
  });

  it("aplica el tamaño del spinner", () => {
    render(<LoadingState size="lg" />);

    expect(screen.getByRole("status")).toHaveClass("size-8");
  });

  it("permite aplicar una clase personalizada", () => {
    render(<LoadingState className="custom-loading" />);

    expect(
      screen.getByText("", { selector: "div.custom-loading" }),
    ).toHaveClass("custom-loading");
  });

  it("permite pasar atributos HTML adicionales", () => {
    render(<LoadingState id="loading-state" data-testid="loading" />);

    const loading = screen.getByTestId("loading");

    expect(loading).toHaveAttribute("id", "loading-state");
  });

  it("expone aria-live para anunciar cambios de carga", () => {
    render(<LoadingState message="Cargando..." />);

    const container = screen.getByText("Cargando...").parentElement;

    expect(container).toHaveAttribute("aria-live", "polite");
  });
});
