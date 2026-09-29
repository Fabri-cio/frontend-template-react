import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfirmDialog,
  EmptyState,
  LoadingState,
} from "../States";

afterEach(() => {
  cleanup();
});

describe("LoadingState", () => {
  it("renderiza el mensaje por defecto", () => {
    render(<LoadingState />);

    expect(screen.getByText("Cargando...")).toBeTruthy();
  });

  it("renderiza un mensaje personalizado", () => {
    render(<LoadingState message="Cargando usuarios..." />);

    expect(screen.getByText("Cargando usuarios...")).toBeTruthy();
  });

  it("expone el estado de carga mediante role=status", () => {
    render(<LoadingState />);

    expect(screen.getByRole("status")).toBeTruthy();
  });
});

describe("EmptyState", () => {
  it("renderiza el título", () => {
    render(<EmptyState title="Sin usuarios" />);

    expect(screen.getByText("Sin usuarios")).toBeTruthy();
  });

  it("renderiza la descripción cuando se proporciona", () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="No se encontraron registros."
      />,
    );

    expect(screen.getByText("No se encontraron registros.")).toBeTruthy();
  });

  it("permite renderizar una acción personalizada", () => {
    render(
      <EmptyState
        title="Sin registros"
        action={<button type="button">Crear registro</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Crear registro" }),
    ).toBeTruthy();
  });

  it("permite reemplazar el icono por uno personalizado", () => {
    render(
      <EmptyState
        title="Sin registros"
        icon={<span data-testid="custom-empty-icon">!</span>}
      />,
    );

    expect(screen.getByTestId("custom-empty-icon")).toBeTruthy();
  });
});

describe("ConfirmDialog", () => {
  it("no renderiza el contenido cuando está cerrado", () => {
    render(
      <ConfirmDialog
        open={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Eliminar registro"
        message="¿Deseas eliminar este registro?"
      />,
    );

    expect(screen.queryByText("Eliminar registro")).toBeNull();
    expect(screen.queryByText("¿Deseas eliminar este registro?")).toBeNull();
  });

  it("renderiza título, mensaje y acciones cuando está abierto", () => {
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Eliminar registro"
        message="¿Deseas eliminar este registro?"
      />,
    );

    expect(screen.getByText("Eliminar registro")).toBeTruthy();
    expect(
      screen.getByText("¿Deseas eliminar este registro?"),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: "Confirmar" }),
    ).toBeTruthy();
  });

  it("ejecuta onClose al cancelar", () => {
    const onClose = vi.fn();

    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Eliminar registro"
        message="¿Deseas eliminar este registro?"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ejecuta onConfirm al confirmar", () => {
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Eliminar registro"
        message="¿Deseas eliminar este registro?"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("permite personalizar las etiquetas de las acciones", () => {
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirmar operación"
        message="¿Deseas continuar?"
        cancelLabel="Volver"
        confirmLabel="Continuar"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Volver" }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).toBeTruthy();
  });

  it("renderiza children en lugar de message cuando se proporciona", () => {
    const customContent: ReactNode = (
      <div data-testid="custom-confirm-content">
        Contenido personalizado
      </div>
    );

    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Confirmar operación"
        message="Este mensaje no debería aparecer."
      >
        {customContent}
      </ConfirmDialog>,
    );

    expect(screen.getByTestId("custom-confirm-content")).toBeTruthy();
    expect(
      screen.queryByText("Este mensaje no debería aparecer."),
    ).toBeNull();
  });

  it("deshabilita las acciones durante loading", () => {
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Procesando"
        message="Espere un momento."
        loading
      />,
    );

    const cancelButton = screen.getByRole("button", {
      name: "Cancelar",
    });

    const confirmButton = screen.getByRole("button", {
      name: "Confirmar",
    });

    expect(cancelButton).toHaveProperty("disabled", true);
    expect(confirmButton).toHaveProperty("disabled", true);
  });

  it("permite usar una variante personalizada para confirmar", () => {
    render(
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Eliminar"
        message="¿Confirmar eliminación?"
        confirmVariant="destructive"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Confirmar" }),
    ).toBeTruthy();
  });
});