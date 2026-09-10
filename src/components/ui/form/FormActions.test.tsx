import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FormActions from "./FormActions";

describe("FormActions", () => {
  it("renderiza sus acciones", () => {
    render(
      <FormActions>
        <button type="button">Cancelar</button>
        <button type="submit">Guardar</button>
      </FormActions>,
    );

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("permite agregar una clase personalizada", () => {
    render(
      <FormActions className="mt-6">
        <button type="button">Guardar</button>
      </FormActions>,
    );

    expect(
      screen.getByRole("button", { name: "Guardar" }).parentElement,
    ).toHaveClass("mt-6");
  });
});
