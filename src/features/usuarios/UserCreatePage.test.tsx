import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UserCreatePage from "./UserCreatePage";

import { AppError } from "../../app/errors/app-error";

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    expect(
      screen.queryByRole("heading", { name: "Confirmar creación" }),
    ).not.toBeInTheDocument();
  });

  it("muestra el modal de confirmación con los datos del usuario", async () => {
    const user = userEvent.setup();

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

    const dialog = screen.getByRole("dialog");

    expect(
      screen.getByRole("heading", { name: "Confirmar creación" }),
    ).toBeInTheDocument();

    expect(dialog).toHaveTextContent("juan");
    expect(dialog).toHaveTextContent("juan@example.com");
    expect(dialog).toHaveTextContent("Juan");
    expect(dialog).toHaveTextContent("Pérez");
    expect(dialog).toHaveTextContent("Activo");

    // La contraseña nunca debe mostrarse en la confirmación.
    expect(dialog).not.toHaveTextContent("secret123");

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("crea el usuario al confirmar y navega a la lista", async () => {
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

    expect(
      screen.getByRole("heading", { name: "Confirmar creación" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sí, crear" }));

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

    expect(
      screen.queryByRole("heading", { name: "Confirmar creación" }),
    ).not.toBeInTheDocument();
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

    expect(
      screen.getByRole("heading", { name: "Confirmar creación" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sí, crear" }));

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

  it("cierra el modal al cancelar la confirmación", async () => {
    const user = userEvent.setup();

    render(<UserCreatePage />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(
      screen.getByRole("heading", { name: "Confirmar creación" }),
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    expect(
      screen.queryByRole("heading", { name: "Confirmar creación" }),
    ).not.toBeInTheDocument();

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navega a la lista al cancelar el formulario", async () => {
    const user = userEvent.setup();

    render(<UserCreatePage />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("muestra errores de validación en el formulario", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockRejectedValue(
      new AppError("VALIDATION_ERROR", "Error de validación", {
        details: {
          username: ["El usuario ya existe."],
          email: ["El correo ya está registrado."],
        },
      }),
    );

    render(<UserCreatePage />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(
      screen.getByRole("heading", { name: "Confirmar creación" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sí, crear" }));

    await waitFor(() => {
      expect(screen.getByText("El usuario ya existe.")).toBeInTheDocument();

      expect(
        screen.getByText("El correo ya está registrado."),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", { name: "Confirmar creación" }),
    ).not.toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
