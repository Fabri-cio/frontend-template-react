import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("renderiza el porcentaje correctamente", () => {
    render(<ProgressBar value={25} max={100} showLabel />);

    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("calcula correctamente el porcentaje", () => {
    render(<ProgressBar value={50} max={200} showLabel />);

    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("no supera el 100%", () => {
    render(<ProgressBar value={150} max={100} showLabel />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("no permite porcentajes menores que 0", () => {
    render(<ProgressBar value={-50} max={100} showLabel />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("usa la variante visual indicada", () => {
    render(<ProgressBar value={50} max={100} variant="success" />);

    const progressbar = screen.getByRole("progressbar");
    const progress = progressbar.firstElementChild;

    expect(progress).toHaveClass("bg-success");
  });

  it("renderiza el label cuando se proporciona", () => {
    render(<ProgressBar value={75} max={100} label="Producción" showLabel />);

    expect(screen.getByText("Producción")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("maneja max igual a cero sin romper", () => {
    render(<ProgressBar value={50} max={0} showLabel />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
