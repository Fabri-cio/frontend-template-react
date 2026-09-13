import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UserEditPage from "./UserEditPage";

import { AppError } from "../../app/errors/app-error";
import { ToastProvider } from "../../components/ui";

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();

const mockUser = {
  id: 1,
  username: "juan",
  email: "juan@example.com",
  first_name: "Juan",
  last_name: "Pérez",
  is_active: true,
  last_login: null,
  date_joined: "2026-01-15T10:00:00Z",
};

const mockUseUser = vi.fn();

function renderUserEditPage() {
  return render(
    <ToastProvider>
      <UserEditPage />
    </ToastProvider>,
  );
}

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

vi.mock("./users.hooks", () => ({
  useUser: (...args: unknown[]) => mockUseUser(...args),
  useUpdateUser: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("UserEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockReset();
    mockNavigate.mockReset();

    mockUseUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("muestra el estado de carga", () => {
    mockUseUser.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderUserEditPage();

    expect(
      screen.getByRole("heading", { name: "Editar usuario" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
      "Cargando...",
    );
  });

  it("renderiza los datos del usuario en el formulario", () => {
    renderUserEditPage();

    expect(
      screen.getByRole("heading", { name: "Editar usuario" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^Usuario/)).toHaveValue("juan");

    expect(screen.getByLabelText(/^Correo electrónico/)).toHaveValue(
      "juan@example.com",
    );

    expect(screen.getByLabelText(/^Nombre$/)).toHaveValue("Juan");

    expect(screen.getByLabelText(/^Apellido$/)).toHaveValue("Pérez");

    expect(screen.getByLabelText(/^Contraseña/)).toHaveValue("");

    expect(screen.getByLabelText(/^Estado/)).toHaveValue("true");

    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Confirmar cambios" }),
    ).not.toBeInTheDocument();
  });

  it("muestra un error cuando no puede cargar el usuario", () => {
    mockUseUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new AppError("NOT_FOUND", "Usuario no encontrado"),
    });

    renderUserEditPage();

    expect(
      screen.getByRole("heading", { name: "Editar usuario" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Usuario no encontrado",
    );

    expect(screen.getByRole("button", { name: "Volver" })).toBeInTheDocument();
  });

  it("navega a la lista al pulsar Volver desde el estado de error", async () => {
    const user = userEvent.setup();

    mockUseUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new AppError("NOT_FOUND", "Usuario no encontrado"),
    });

    renderUserEditPage();

    await user.click(screen.getByRole("button", { name: "Volver" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("navega a la lista al cancelar el formulario", async () => {
    const user = userEvent.setup();

    renderUserEditPage();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  it("muestra el modal de confirmación con los datos modificados", async () => {
    const user = userEvent.setup();

    renderUserEditPage();

    const usernameInput = screen.getByLabelText(/^Usuario/);

    await user.clear(usernameInput);
    await user.type(usernameInput, "juan-nuevo");

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const dialog = screen.getByRole("dialog");

    expect(
      screen.getByRole("heading", { name: "Confirmar cambios" }),
    ).toBeInTheDocument();

    expect(dialog).toHaveTextContent("juan-nuevo");
    expect(dialog).toHaveTextContent("juan@example.com");
    expect(dialog).toHaveTextContent("Juan");
    expect(dialog).toHaveTextContent("Pérez");
    expect(dialog).toHaveTextContent("Activo");

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("cierra el modal al cancelar la confirmación", async () => {
    const user = userEvent.setup();

    renderUserEditPage();

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      screen.getByRole("heading", { name: "Confirmar cambios" }),
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    expect(
      screen.queryByRole("heading", { name: "Confirmar cambios" }),
    ).not.toBeInTheDocument();

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("actualiza el usuario, muestra Toast de éxito y navega a la lista", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue({
      ...mockUser,
      username: "juan-nuevo",
    });

    renderUserEditPage();

    const usernameInput = screen.getByLabelText(/^Usuario/);

    await user.clear(usernameInput);
    await user.type(usernameInput, "juan-nuevo");

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await user.click(
      screen.getByRole("button", { name: "Sí, guardar cambios" }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          username: "juan-nuevo",
          email: "juan@example.com",
          first_name: "Juan",
          last_name: "Pérez",
          is_active: true,
        },
      });
    });

    await waitFor(() => {
      const toast = screen.getByRole("status");

      expect(toast).toHaveTextContent("Usuario actualizado");
      expect(toast).toHaveTextContent("El usuario se actualizó correctamente.");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/users");

    expect(
      screen.queryByRole("heading", { name: "Confirmar cambios" }),
    ).not.toBeInTheDocument();
  });

  it("omite nombre y apellido cuando están vacíos", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue(mockUser);

    renderUserEditPage();

    const firstNameInput = screen.getByLabelText(/^Nombre$/);
    const lastNameInput = screen.getByLabelText(/^Apellido$/);

    await user.clear(firstNameInput);
    await user.clear(lastNameInput);

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await user.click(
      screen.getByRole("button", { name: "Sí, guardar cambios" }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          username: "juan",
          email: "juan@example.com",
          first_name: undefined,
          last_name: undefined,
          is_active: true,
        },
      });
    });
  });

  it("no envía la contraseña en la actualización normal", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue(mockUser);

    renderUserEditPage();

    await user.type(screen.getByLabelText(/^Contraseña/), "new-secret-123");

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const dialog = screen.getByRole("dialog");

    expect(dialog).not.toHaveTextContent("new-secret-123");

    await user.click(
      screen.getByRole("button", { name: "Sí, guardar cambios" }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          username: "juan",
          email: "juan@example.com",
          first_name: "Juan",
          last_name: "Pérez",
          is_active: true,
        },
      });
    });
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

    renderUserEditPage();

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await user.click(
      screen.getByRole("button", { name: "Sí, guardar cambios" }),
    );

    await waitFor(() => {
      expect(screen.getByText("El usuario ya existe.")).toBeInTheDocument();

      expect(
        screen.getByText("El correo ya está registrado."),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", { name: "Confirmar cambios" }),
    ).not.toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("muestra Toast cuando ocurre un error general", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockRejectedValue(
      new AppError("SERVER_ERROR", "Error interno del servidor"),
    );

    renderUserEditPage();

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await user.click(
      screen.getByRole("button", { name: "Sí, guardar cambios" }),
    );

    await waitFor(() => {
      const toast = screen.getByRole("status");

      expect(toast).toHaveTextContent("Error del servidor");
      expect(toast).toHaveTextContent("Ocurrió un error en el servidor.");
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(
      screen.queryByRole("heading", { name: "Confirmar cambios" }),
    ).not.toBeInTheDocument();
  });
});
