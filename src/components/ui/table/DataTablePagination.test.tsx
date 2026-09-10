import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DataTablePagination from "./DataTablePagination";

describe("DataTablePagination", () => {
  it("muestra el rango de registros", () => {
    render(
      <DataTablePagination
        page={2}
        pageSize={10}
        totalItems={35}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Mostrando 11 a 20 de 35 registros."),
    ).toBeInTheDocument();
  });

  it("muestra el estado vacío", () => {
    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalItems={0}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("No hay registros.")).toBeInTheDocument();
  });

  it("calcula correctamente el total de páginas", () => {
    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalItems={35}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Última página",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Página 4",
      }),
    ).toBeInTheDocument();
  });

  it("permite cambiar de página", () => {
    const onPageChange = vi.fn();

    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalItems={35}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Página 2",
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("permite cambiar el tamaño de página", () => {
    const onPageSizeChange = vi.fn();

    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalItems={35}
        onPageChange={vi.fn()}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: /filas por página/i,
      }),
      {
        target: {
          value: "25",
        },
      },
    );

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it("oculta el selector de tamaño cuando se solicita", () => {
    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalItems={35}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        showPageSize={false}
      />,
    );

    expect(
      screen.queryByRole("combobox", {
        name: /filas por página/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("permite personalizar las opciones de tamaño", () => {
    const onPageSizeChange = vi.fn();

    render(
      <DataTablePagination
        page={1}
        pageSize={20}
        totalItems={100}
        onPageChange={vi.fn()}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[20, 40, 80]}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: /filas por página/i,
    });

    expect(select).toHaveValue("20");

    expect(screen.getByRole("option", { name: "40" })).toBeInTheDocument();

    fireEvent.change(select, {
      target: {
        value: "40",
      },
    });

    expect(onPageSizeChange).toHaveBeenCalledWith(40);
  });
});
