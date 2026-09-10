import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FormField from "./FormField";

describe("FormField", () => {
  it("renderiza el label y conecta htmlFor con el campo", () => {
    render(
      <FormField label="Usuario" htmlFor="username">
        <input id="username" />
      </FormField>,
    );

    const label = screen.getByText("Usuario");
    const input = screen.getByRole("textbox");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "username");
    expect(input).toHaveAttribute("id", "username");
  });

  it("muestra el indicador de campo requerido", () => {
    render(
      <FormField label="Correo" htmlFor="email" required>
        <input id="email" />
      </FormField>,
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("no muestra el indicador requerido cuando no corresponde", () => {
    render(
      <FormField label="Nombre" htmlFor="name">
        <input id="name" />
      </FormField>,
    );

    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("muestra la descripción", () => {
    render(
      <FormField
        label="Contraseña"
        htmlFor="password"
        description="Debe tener al menos 8 caracteres."
      >
        <input id="password" type="password" />
      </FormField>,
    );

    expect(
      screen.getByText("Debe tener al menos 8 caracteres."),
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de error", () => {
    render(
      <FormField label="Correo" htmlFor="email" error="El correo no es válido.">
        <input id="email" />
      </FormField>,
    );

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("El correo no es válido.");
  });

  it("oculta la descripción cuando existe un error", () => {
    render(
      <FormField
        label="Correo"
        htmlFor="email"
        description="Introduce un correo válido."
        error="El correo no es válido."
      >
        <input id="email" />
      </FormField>,
    );

    expect(
      screen.queryByText("Introduce un correo válido."),
    ).not.toBeInTheDocument();

    expect(screen.getByText("El correo no es válido.")).toBeInTheDocument();
  });

  it("permite renderizar cualquier contenido como campo", () => {
    render(
      <FormField label="Estado">
        <select aria-label="Estado">
          <option value="active">Activo</option>
        </select>
      </FormField>,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
