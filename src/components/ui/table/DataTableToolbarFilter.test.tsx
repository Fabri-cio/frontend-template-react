import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DataTableToolbarFilter from "./DataTableToolbarFilter";

const options = [
  {
    value: "active",
    label: "Activos",
  },
  {
    value: "inactive",
    label: "Inactivos",
  },
];

describe("DataTableToolbarFilter", () => {
  it("renderiza las opciones", () => {
    render(
      <DataTableToolbarFilter
        value="active"
        onChange={vi.fn()}
        options={options}
        aria-label="Estado"
      />,
    );

    expect(
      screen.getByRole("option", {
        name: "Activos",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Inactivos",
      }),
    ).toBeInTheDocument();
  });

  it("muestra el valor seleccionado", () => {
    render(
      <DataTableToolbarFilter
        value="inactive"
        onChange={vi.fn()}
        options={options}
        aria-label="Estado"
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Estado",
      }),
    ).toHaveValue("inactive");
  });

  it("notifica el cambio de opción", () => {
    const onChange = vi.fn();

    render(
      <DataTableToolbarFilter
        value="active"
        onChange={onChange}
        options={options}
        aria-label="Estado"
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Estado",
      }),
      {
        target: {
          value: "inactive",
        },
      },
    );

    expect(onChange).toHaveBeenCalledWith("inactive");
  });

  it("renderiza una etiqueta", () => {
    render(
      <DataTableToolbarFilter
        value="active"
        onChange={vi.fn()}
        options={options}
        label="Estado"
      />,
    );

    expect(screen.getByText("Estado")).toBeInTheDocument();
  });

  it("usa la etiqueta como nombre accesible", () => {
    render(
      <DataTableToolbarFilter
        value="active"
        onChange={vi.fn()}
        options={options}
        label="Estado"
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Estado",
      }),
    ).toBeInTheDocument();
  });

  it("permite mostrar un placeholder", () => {
    render(
      <DataTableToolbarFilter
        value=""
        onChange={vi.fn()}
        options={options}
        aria-label="Estado"
        placeholder="Todos los estados"
      />,
    );

    expect(
      screen.getByRole("option", {
        name: "Todos los estados",
      }),
    ).toBeInTheDocument();
  });

  it("permite aplicar className", () => {
    const { container } = render(
      <DataTableToolbarFilter
        value="active"
        onChange={vi.fn()}
        options={options}
        aria-label="Estado"
        className="mi-filtro"
      />,
    );

    expect(container.firstElementChild).toHaveClass("mi-filtro");
  });
});
