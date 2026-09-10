import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Form from "./Form";

describe("Form", () => {
  it("renderiza sus hijos", () => {
    render(
      <Form>
        <input aria-label="Nombre" />
      </Form>,
    );

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("ejecuta onSubmit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Guardar</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("conserva atributos HTML del formulario", () => {
    render(
      <Form
        aria-label="Formulario de prueba"
        noValidate
        data-testid="test-form"
      >
        <input />
      </Form>,
    );

    const form = screen.getByTestId("test-form");

    expect(form).toHaveAttribute("aria-label", "Formulario de prueba");
    expect(form).toHaveAttribute("novalidate");
  });

  it("permite agregar una clase personalizada", () => {
    render(
      <Form data-testid="test-form" className="max-w-2xl">
        <input />
      </Form>,
    );

    expect(screen.getByTestId("test-form")).toHaveClass("max-w-2xl");
  });
});
