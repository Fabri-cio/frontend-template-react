import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Toast from "../Toast";

describe("Toast", () => {
  it("renderiza el mensaje", () => {
    render(<Toast>Operación completada.</Toast>);

    expect(screen.getByText("Operación completada.")).toBeInTheDocument();
  });

  it("renderiza el título cuando se proporciona", () => {
    render(<Toast title="Éxito">El usuario fue creado correctamente.</Toast>);

    expect(screen.getByText("Éxito")).toBeInTheDocument();

    expect(
      screen.getByText("El usuario fue creado correctamente."),
    ).toBeInTheDocument();
  });

  it("usa info como variante por defecto", () => {
    render(<Toast>Información importante.</Toast>);

    const toast = screen.getByRole("status");

    expect(toast.className).toContain("bg-blue-50");
  });

  it.each([
    ["success", "bg-green-50"],
    ["error", "bg-red-50"],
    ["warning", "bg-yellow-50"],
    ["info", "bg-blue-50"],
  ] as const)(
    "aplica los estilos de la variante %s",
    (variant, expectedClass) => {
      render(<Toast variant={variant}>Mensaje</Toast>);

      expect(screen.getByRole("status").className).toContain(expectedClass);
    },
  );

  it("usa aria-live polite para variantes no críticas", () => {
    render(<Toast variant="success">Operación completada.</Toast>);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("usa aria-live assertive para errores", () => {
    render(<Toast variant="error">Ocurrió un error.</Toast>);

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-live",
      "assertive",
    );
  });

  it("muestra el botón de cierre cuando se proporciona onClose", () => {
    const onClose = vi.fn();

    render(<Toast onClose={onClose}>Mensaje.</Toast>);

    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  it("no muestra el botón de cierre cuando no se proporciona onClose", () => {
    render(<Toast>Mensaje.</Toast>);

    expect(
      screen.queryByRole("button", { name: "Cerrar" }),
    ).not.toBeInTheDocument();
  });

  it("ejecuta onClose al cerrar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Toast onClose={onClose}>Mensaje.</Toast>);

    await user.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("permite personalizar el nombre accesible del botón de cierre", () => {
    const onClose = vi.fn();

    render(
      <Toast onClose={onClose} closeLabel="Cerrar notificación">
        Mensaje.
      </Toast>,
    );

    expect(
      screen.getByRole("button", {
        name: "Cerrar notificación",
      }),
    ).toBeInTheDocument();
  });

  it("permite pasar contenido arbitrario como children", () => {
    render(
      <Toast>
        <strong>Operación completada</strong>
      </Toast>,
    );

    expect(screen.getByText("Operación completada")).toBeInTheDocument();
  });
});
