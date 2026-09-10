import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import UserCreatePage from "./UserCreatePage";

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("./users.hooks", () => ({
  useCreateUser: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("UserCreatePage", () => {
  it("renderiza el título y el formulario de creación", () => {
    render(<UserCreatePage />);

    expect(
      screen.getByRole("heading", { name: "Crear usuario" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^Usuario/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Correo electrónico/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Crear usuario" }),
    ).toBeInTheDocument();
  });

  it("crea el usuario y navega a la lista", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue({
      id: 1,
      username: "juan",
      email: "juan@example.com",
    });

    render(<UserCreatePage />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.type(screen.getByLabelText(/^Nombre$/), "Juan");

    await user.type(screen.getByLabelText(/^Apellido$/), "Pérez");

    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: "juan",
        email: "juan@example.com",
        password: "secret123",
        first_name: "Juan",
        last_name: "Pérez",
        is_active: true,
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("omite nombre y apellido cuando están vacíos", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue({
      id: 1,
      username: "juan",
      email: "juan@example.com",
    });

    render(<UserCreatePage />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: "juan",
        email: "juan@example.com",
        password: "secret123",
        first_name: undefined,
        last_name: undefined,
        is_active: true,
      });
    });
  });

  it("navega a la lista al cancelar", async () => {
    const user = userEvent.setup();

    render(<UserCreatePage />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  //   it("muestra el estado de guardado mientras la mutación está pendiente", () => {
  //     vi.doMock("./users.hooks", () => ({
  //       useCreateUser: () => ({
  //         mutateAsync: mockMutateAsync,
  //         isPending: true,
  //       }),
  //     }));

  //     render(<UserCreatePage />);

  //     expect(
  //       screen.getByRole("button", { name: "Crear usuario" }),
  //     ).toBeInTheDocument();
  //   });
});
