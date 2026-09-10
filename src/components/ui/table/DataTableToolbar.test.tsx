import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "../Button";
import DataTableToolbar from "./DataTableToolbar";

describe("DataTableToolbar", () => {
  it("renderiza el campo de búsqueda", () => {
    render(<DataTableToolbar search="" onSearchChange={vi.fn()} />);

    expect(
      screen.getByRole("searchbox", {
        name: "Buscar",
      }),
    ).toBeInTheDocument();
  });

  it("muestra el valor de búsqueda", () => {
    render(<DataTableToolbar search="Juan" onSearchChange={vi.fn()} />);

    expect(
      screen.getByRole("searchbox", {
        name: "Buscar",
      }),
    ).toHaveValue("Juan");
  });

  it("notifica cambios en la búsqueda", () => {
    const onSearchChange = vi.fn();

    render(<DataTableToolbar search="" onSearchChange={onSearchChange} />);

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Buscar",
      }),
      {
        target: {
          value: "Juan",
        },
      },
    );

    expect(onSearchChange).toHaveBeenCalledWith("Juan");
  });

  it("permite personalizar el placeholder", () => {
    render(
      <DataTableToolbar
        search=""
        onSearchChange={vi.fn()}
        searchPlaceholder="Buscar usuarios..."
      />,
    );

    expect(
      screen.getByPlaceholderText("Buscar usuarios..."),
    ).toBeInTheDocument();
  });

  it("renderiza acciones", () => {
    render(
      <DataTableToolbar
        actions={<Button type="button">Nuevo usuario</Button>}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Nuevo usuario",
      }),
    ).toBeInTheDocument();
  });

  it("renderiza contenido adicional", () => {
    render(
      <DataTableToolbar>
        <span>Filtro adicional</span>
      </DataTableToolbar>,
    );

    expect(screen.getByText("Filtro adicional")).toBeInTheDocument();
  });

  it("permite utilizar búsqueda y acciones al mismo tiempo", () => {
    const onSearchChange = vi.fn();

    render(
      <DataTableToolbar
        search=""
        onSearchChange={onSearchChange}
        actions={<Button type="button">Crear</Button>}
      />,
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Buscar",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Crear",
      }),
    ).toBeInTheDocument();
  });

  it("no renderiza búsqueda si no se proporciona su estado", () => {
    render(<DataTableToolbar />);

    expect(
      screen.queryByRole("searchbox", {
        name: "Buscar",
      }),
    ).not.toBeInTheDocument();
  });
});
