import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DataTable, { type DataTableColumn } from "./DataTable";

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: DataTableColumn<User>[] = [
  {
    id: "name",
    header: "Nombre",
    accessor: "name",
    sortable: true,
  },
  {
    id: "email",
    header: "Correo",
    accessor: "email",
  },
];

const users: User[] = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
  },
  {
    id: 2,
    name: "Ana López",
    email: "ana@example.com",
  },
];

describe("DataTable", () => {
  it("renderiza encabezados y datos", () => {
    render(
      <DataTable data={users} columns={columns} getRowId={(user) => user.id} />,
    );

    expect(
      screen.getByRole("columnheader", {
        name: /nombre/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /correo/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });

  it("muestra el mensaje cuando no existen datos", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        getRowId={(user) => user.id}
        emptyMessage="No existen usuarios."
      />,
    );

    expect(screen.getByText("No existen usuarios.")).toBeInTheDocument();
  });

  it("muestra el estado de carga", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        getRowId={(user) => user.id}
        loading
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renderiza una columna mediante cell", () => {
    const customColumns: DataTableColumn<User>[] = [
      {
        id: "name",
        header: "Usuario",
        cell: (user) => <strong>{user.name.toUpperCase()}</strong>,
      },
    ];

    render(
      <DataTable
        data={users}
        columns={customColumns}
        getRowId={(user) => user.id}
      />,
    );

    expect(screen.getByText("JUAN PÉREZ")).toBeInTheDocument();
  });

  it("permite ordenar una columna", () => {
    const onSortChange = vi.fn();

    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        onSortChange={onSortChange}
      />,
    );

    screen
      .getByRole("button", {
        name: /nombre/i,
      })
      .click();

    expect(onSortChange).toHaveBeenCalledWith({
      id: "name",
      direction: "asc",
    });
  });

  it("cambia de ascendente a descendente y después elimina el orden", () => {
    const onSortChange = vi.fn();

    const { rerender } = render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        sort={{
          id: "name",
          direction: "asc",
        }}
        onSortChange={onSortChange}
      />,
    );

    const button = screen.getByRole("button", {
      name: /nombre/i,
    });

    button.click();

    expect(onSortChange).toHaveBeenLastCalledWith({
      id: "name",
      direction: "desc",
    });

    rerender(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        sort={{
          id: "name",
          direction: "desc",
        }}
        onSortChange={onSortChange}
      />,
    );

    screen
      .getByRole("button", {
        name: /nombre/i,
      })
      .click();

    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it("permite seleccionar filas", () => {
    const onSelectedRowsChange = vi.fn();

    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        selectable
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(3);

    checkboxes[1].click();

    expect(onSelectedRowsChange).toHaveBeenCalledWith([1]);
  });

  it("permite seleccionar todas las filas", () => {
    const onSelectedRowsChange = vi.fn();

    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        selectable
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");

    checkboxes[0].click();

    expect(onSelectedRowsChange).toHaveBeenCalledWith([1, 2]);
  });

  it("respeta la selección controlada", () => {
    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        selectable
        selectedRows={[2]}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("aplica aria-sort a la columna ordenada", () => {
    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        sort={{
          id: "name",
          direction: "asc",
        }}
      />,
    );

    expect(
      screen.getByRole("columnheader", {
        name: /nombre/i,
      }),
    ).toHaveAttribute("aria-sort", "ascending");
  });

  it("usa el id de la fila como key y permite sticky header", () => {
    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        stickyHeader
      />,
    );

    const header = screen.getByRole("columnheader", {
      name: /nombre/i,
    });

    expect(header.className).toContain("sticky");
  });
});
