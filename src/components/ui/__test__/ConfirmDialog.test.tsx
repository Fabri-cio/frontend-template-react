import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ConfirmDialog from "../ConfirmDialog";

afterEach(() => {
  cleanup();
});

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  title: "Confirmar operación",
  message: "¿Deseas continuar?",
};

describe("ConfirmDialog", () => {
  it("no muestra el diálogo cuando está cerrado", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);

    expect(screen.queryByText("Confirmar operación")).toBeNull();
  });

  it("muestra el título y mensaje cuando está abierto", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("Confirmar operación")).toBeTruthy();

    expect(screen.getByText("¿Deseas continuar?")).toBeTruthy();
  });

  it("renderiza las etiquetas por defecto", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeTruthy();

    expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  });

  it("ejecuta onClose al cancelar", () => {
    const onClose = vi.fn();

    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ejecuta onConfirm al confirmar", () => {
    const onConfirm = vi.fn();

    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("permite personalizar las etiquetas", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        cancelLabel="Volver"
        confirmLabel="Continuar"
      />,
    );

    expect(screen.getByRole("button", { name: "Volver" })).toBeTruthy();

    expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy();
  });

  it("permite cambiar la variante del botón de confirmación", () => {
    render(<ConfirmDialog {...defaultProps} confirmVariant="destructive" />);

    expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  });

  it("permite mostrar contenido personalizado mediante children", () => {
    render(
      <ConfirmDialog {...defaultProps}>
        <div data-testid="custom-content">Información adicional</div>
      </ConfirmDialog>,
    );

    expect(screen.getByTestId("custom-content")).toBeTruthy();

    expect(screen.queryByText("¿Deseas continuar?")).toBeNull();
  });

  it("deshabilita cancelar y confirmar durante loading", () => {
    render(<ConfirmDialog {...defaultProps} loading />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveProperty(
      "disabled",
      true,
    );

    expect(screen.getByRole("button", { name: /Confirmar/ })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("permite ejecutar onConfirm asíncronamente", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
