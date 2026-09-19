import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Tabs from "./Tabs";

describe("Tabs", () => {
  const items = [
    { value: "usuarios", label: "Usuarios", count: 10 },
    { value: "roles", label: "Roles", count: 5 },
    { value: "permisos", label: "Permisos" },
  ];

  it("renderiza todas las pestañas", () => {
    render(<Tabs value="usuarios" items={items} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /usuarios/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /roles/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /permisos/i })).toBeInTheDocument();
  });

  it("marca correctamente la pestaña activa", () => {
    render(<Tabs value="roles" items={items} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /roles/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("tab", { name: /usuarios/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("ejecuta onChange al seleccionar una pestaña", () => {
    const onChange = vi.fn();

    render(<Tabs value="usuarios" items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: /roles/i }));

    expect(onChange).toHaveBeenCalledWith("roles");
  });

  it("muestra el contador cuando está definido", () => {
    render(<Tabs value="usuarios" items={items} onChange={vi.fn()} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("no permite seleccionar una pestaña deshabilitada", () => {
    const onChange = vi.fn();

    render(
      <Tabs
        value="usuarios"
        items={[
          { value: "usuarios", label: "Usuarios" },
          { value: "roles", label: "Roles", disabled: true },
        ]}
        onChange={onChange}
      />,
    );

    const rolesTab = screen.getByRole("tab", { name: /roles/i });

    expect(rolesTab).toBeDisabled();

    fireEvent.click(rolesTab);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("permite navegar hacia la siguiente pestaña con ArrowRight", () => {
    const onChange = vi.fn();

    render(<Tabs value="usuarios" items={items} onChange={onChange} />);

    const usuariosTab = screen.getByRole("tab", { name: /usuarios/i });

    fireEvent.keyDown(usuariosTab, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith("roles");
  });

  it("permite navegar hacia la pestaña anterior con ArrowLeft", () => {
    const onChange = vi.fn();

    render(<Tabs value="roles" items={items} onChange={onChange} />);

    const rolesTab = screen.getByRole("tab", { name: /roles/i });

    fireEvent.keyDown(rolesTab, { key: "ArrowLeft" });

    expect(onChange).toHaveBeenCalledWith("usuarios");
  });

  it("permite ir a la primera pestaña con Home", () => {
    const onChange = vi.fn();

    render(<Tabs value="permisos" items={items} onChange={onChange} />);

    const permisosTab = screen.getByRole("tab", { name: /permisos/i });

    fireEvent.keyDown(permisosTab, { key: "Home" });

    expect(onChange).toHaveBeenCalledWith("usuarios");
  });

  it("permite ir a la última pestaña con End", () => {
    const onChange = vi.fn();

    render(<Tabs value="usuarios" items={items} onChange={onChange} />);

    const usuariosTab = screen.getByRole("tab", { name: /usuarios/i });

    fireEvent.keyDown(usuariosTab, { key: "End" });

    expect(onChange).toHaveBeenCalledWith("permisos");
  });

  it("omite las pestañas deshabilitadas durante la navegación", () => {
    const onChange = vi.fn();

    render(
      <Tabs
        value="usuarios"
        items={[
          { value: "usuarios", label: "Usuarios" },
          { value: "roles", label: "Roles", disabled: true },
          { value: "permisos", label: "Permisos" },
        ]}
        onChange={onChange}
      />,
    );

    const usuariosTab = screen.getByRole("tab", { name: /usuarios/i });

    fireEvent.keyDown(usuariosTab, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith("permisos");
  });

  it("asigna tabIndex correctamente", () => {
    render(<Tabs value="roles" items={items} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /roles/i })).toHaveAttribute(
      "tabindex",
      "0",
    );

    expect(screen.getByRole("tab", { name: /usuarios/i })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("expone la estructura ARIA de tabs", () => {
    render(<Tabs value="usuarios" items={items} onChange={vi.fn()} />);

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );

    expect(screen.getByRole("tab", { name: /usuarios/i })).toHaveAttribute(
      "role",
      "tab",
    );
  });
});
