import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("renderiza el título como heading principal", () => {
    render(<PageHeader title="Productos" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Productos",
      }),
    ).toBeInTheDocument();
  });

  it("renderiza la descripción cuando se proporciona", () => {
    render(<PageHeader title="Productos" description="Gestiona tu catálogo" />);

    expect(screen.getByText("Gestiona tu catálogo")).toBeInTheDocument();
  });

  it("no renderiza la descripción cuando no se proporciona", () => {
    render(<PageHeader title="Productos" />);

    expect(screen.queryByText("Gestiona tu catálogo")).not.toBeInTheDocument();
  });

  it("renderiza el breadcrumb cuando se proporciona", () => {
    render(
      <PageHeader
        title="Productos"
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Productos" }]}
      />,
    );

    expect(
      screen.getByRole("navigation", {
        name: "Breadcrumb",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Inicio",
      }),
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByText("Productos", {
        selector: '[aria-current="page"]',
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("no renderiza el breadcrumb cuando no se proporciona", () => {
    render(<PageHeader title="Productos" />);

    expect(
      screen.queryByRole("navigation", {
        name: "Breadcrumb",
      }),
    ).not.toBeInTheDocument();
  });

  it("marca el último elemento del breadcrumb como página actual", () => {
    render(
      <PageHeader
        title="Productos"
        breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Catálogo", href: "/catalogo" },
          { label: "Productos" },
        ]}
      />,
    );

    expect(
      screen.getByText("Productos", {
        selector: '[aria-current="page"]',
      }),
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("link", {
        name: "Inicio",
      }),
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByRole("link", {
        name: "Catálogo",
      }),
    ).toHaveAttribute("href", "/catalogo");
  });

  it("renderiza las acciones cuando se proporcionan", () => {
    render(
      <PageHeader
        title="Productos"
        actions={<button type="button">Nueva acción</button>}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Nueva acción",
      }),
    ).toBeInTheDocument();
  });

  it("permite renderizar múltiples acciones", () => {
    render(
      <PageHeader
        title="Productos"
        actions={
          <>
            <button type="button">Cancelar</button>
            <button type="button">Guardar</button>
          </>
        }
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Guardar",
      }),
    ).toBeInTheDocument();
  });

  it("permite usar contenido React en título y descripción", () => {
    render(
      <PageHeader
        title={<span>Productos destacados</span>}
        description={
          <>
            Gestiona <strong>tu catálogo</strong>
          </>
        }
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Productos destacados",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("tu catálogo")).toBeInTheDocument();
  });

  it("permite pasar atributos HTML adicionales", () => {
    render(
      <PageHeader
        title="Productos"
        id="products-header"
        data-testid="page-header"
      />,
    );

    const header = screen.getByTestId("page-header");

    expect(header).toHaveAttribute("id", "products-header");

    expect(header.tagName).toBe("HEADER");
  });

  it("permite aplicar una clase personalizada", () => {
    render(<PageHeader title="Productos" className="custom-header" />);

    const header = screen.getByRole("banner");

    expect(header).toHaveClass("custom-header");
  });
});
