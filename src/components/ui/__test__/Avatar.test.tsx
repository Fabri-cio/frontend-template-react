import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Avatar from "../Avatar";

describe("Avatar", () => {
  it("muestra las iniciales cuando no se proporciona una imagen", () => {
    render(<Avatar name="Juan Pérez" />);

    expect(screen.getByRole("img")).toHaveTextContent("JP");
  });

  it("genera dos iniciales para un nombre completo", () => {
    render(<Avatar name="Juan Carlos Pérez" />);

    expect(screen.getByRole("img")).toHaveTextContent("JP");
  });

  it("genera hasta dos caracteres para un nombre de una sola palabra", () => {
    render(<Avatar name="Juan" />);

    expect(screen.getByRole("img")).toHaveTextContent("JU");
  });

  it("muestra un fallback cuando no se proporciona un nombre", () => {
    render(<Avatar />);

    expect(screen.getByRole("img")).toHaveTextContent("?");
  });

  it("muestra la imagen cuando se proporciona src", () => {
    render(<Avatar name="Juan Pérez" src="/avatar.jpg" />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", "/avatar.jpg");
    expect(image).toHaveAttribute("alt", "Juan Pérez");
  });

  it("usa el alt proporcionado cuando está disponible", () => {
    render(
      <Avatar
        name="Juan Pérez"
        src="/avatar.jpg"
        alt="Foto de perfil de Juan Pérez"
      />,
    );

    expect(
      screen.getByAltText("Foto de perfil de Juan Pérez"),
    ).toBeInTheDocument();
  });

  it("usa el nombre como alt cuando no se proporciona alt", () => {
    render(<Avatar name="Juan Pérez" src="/avatar.jpg" />);

    expect(screen.getByAltText("Juan Pérez")).toBeInTheDocument();
  });

  it("muestra las iniciales cuando la imagen falla", () => {
    render(<Avatar name="Juan Pérez" src="/avatar.jpg" />);

    const image = screen.getByRole("img");

    fireEvent.error(image);

    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("aplica el tamaño sm", () => {
    render(<Avatar name="Juan Pérez" size="sm" />);

    expect(screen.getByRole("img")).toHaveClass("size-8");
  });

  it("aplica el tamaño md por defecto", () => {
    render(<Avatar name="Juan Pérez" />);

    expect(screen.getByRole("img")).toHaveClass("size-10");
  });

  it("aplica el tamaño lg", () => {
    render(<Avatar name="Juan Pérez" size="lg" />);

    expect(screen.getByRole("img")).toHaveClass("size-12");
  });

  it("permite personalizar las clases", () => {
    render(<Avatar name="Juan Pérez" className="custom-class" />);

    expect(screen.getByRole("img")).toHaveClass("custom-class");
  });

  it("mantiene el nombre como fallback con espacios adicionales", () => {
    render(<Avatar name="  Juan   Pérez  " />);

    expect(screen.getByRole("img")).toHaveTextContent("JP");
  });

  it("permite pasar atributos de imagen adicionales", () => {
    render(
      <Avatar
        name="Juan Pérez"
        src="/avatar.jpg"
        loading="lazy"
        data-testid="avatar-image"
      />,
    );

    expect(screen.getByTestId("avatar-image")).toHaveAttribute(
      "loading",
      "lazy",
    );
  });
});
