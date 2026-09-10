import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

describe("Table", () => {
  it("renderiza la tabla y sus elementos correctamente", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>Juan</TableCell>
            <TableCell>juan@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Nombre" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Email" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Juan" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "juan@example.com" }),
    ).toBeInTheDocument();
  });

  it("aplica el tamaño configurado a la tabla", () => {
    const { rerender } = render(
      <Table size="compact">
        <TableBody>
          <TableRow>
            <TableCell>Dato</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toHaveAttribute("data-size", "compact");

    rerender(
      <Table size="default">
        <TableBody>
          <TableRow>
            <TableCell>Dato</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toHaveAttribute("data-size", "default");
  });

  it("aplica striped y hoverable a las filas", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow striped hoverable>
            <TableCell>Juan</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByRole("row", { name: "Juan" });

    expect(row).toHaveClass("even:bg-muted/30");
    expect(row).toHaveClass("hover:bg-muted/50");
  });

  it("permite marcar una fila como seleccionada", () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>Juan</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByRole("row", { name: "Juan" });

    expect(row).toHaveAttribute("data-selected", "true");
    expect(row).toHaveClass("bg-primary/10");
  });

  it("aplica sticky al encabezado cuando se configura", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sticky>Nombre</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>Juan</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const header = screen.getByRole("columnheader", {
      name: "Nombre",
    });

    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");
  });

  it("aplica alineación a las celdas", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="left">Izquierda</TableCell>
            <TableCell align="center">Centro</TableCell>
            <TableCell align="right">Derecha</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("cell", { name: "Izquierda" })).toHaveClass(
      "text-left",
    );

    expect(screen.getByRole("cell", { name: "Centro" })).toHaveClass(
      "text-center",
    );

    expect(screen.getByRole("cell", { name: "Derecha" })).toHaveClass(
      "text-right",
    );
  });
});
