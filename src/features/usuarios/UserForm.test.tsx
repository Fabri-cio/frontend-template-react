import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import UserForm from "./UserForm";

describe("UserForm", () => {
  it("renderiza todos los campos del formulario", () => {
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/^Usuario/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Correo electrónico/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nombre$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Apellido$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Estado/)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
  });

  it("marca los campos obligatorios correctamente", () => {
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/^Usuario/)).toBeRequired();
    expect(screen.getByLabelText(/^Correo electrónico/)).toBeRequired();
    expect(screen.getByLabelText(/^Contraseña/)).toBeRequired();
    expect(screen.getByLabelText(/^Estado/)).toBeRequired();
  });

  it("permite hacer submit con los datos del formulario", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Nombre$/), "Juan");
    await user.type(screen.getByLabelText(/^Apellido$/), "Pérez");
    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: "juan",
      email: "juan@example.com",
      password: "secret123",
      first_name: "Juan",
      last_name: "Pérez",
      is_active: true,
    });
  });

  it("permite enviar un usuario inactivo", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/^Usuario/), "juan");

    await user.type(
      screen.getByLabelText(/^Correo electrónico/),
      "juan@example.com",
    );

    await user.type(screen.getByLabelText(/^Contraseña/), "secret123");

    await user.selectOptions(screen.getByLabelText(/^Estado/), "false");

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        is_active: false,
      }),
    );
  });

  it("usa los valores iniciales proporcionados", () => {
    render(
      <UserForm
        initialValues={{
          username: "juan",
          email: "juan@example.com",
          first_name: "Juan",
          last_name: "Pérez",
          password: "secret123",
          is_active: false,
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/^Usuario/)).toHaveValue("juan");

    expect(screen.getByLabelText(/^Correo electrónico/)).toHaveValue(
      "juan@example.com",
    );

    expect(screen.getByLabelText(/^Nombre$/)).toHaveValue("Juan");
    expect(screen.getByLabelText(/^Apellido$/)).toHaveValue("Pérez");
    expect(screen.getByLabelText(/^Contraseña/)).toHaveValue("secret123");
    expect(screen.getByLabelText(/^Estado/)).toHaveValue("false");
  });

  it("permite cancelar", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<UserForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("permite hacer opcional la contraseña", () => {
    render(
      <UserForm
        passwordRequired={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/^Contraseña/)).not.toBeRequired();

    expect(
      screen.getByText(
        "Deja este campo vacío si no deseas cambiar la contraseña.",
      ),
    ).toBeInTheDocument();
  });

  it("deshabilita los campos y acciones mientras se guarda", () => {
    render(<UserForm isSubmitting onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/^Usuario/)).toBeDisabled();

    expect(screen.getByLabelText(/^Correo electrónico/)).toBeDisabled();

    expect(screen.getByLabelText(/^Nombre$/)).toBeDisabled();
    expect(screen.getByLabelText(/^Apellido$/)).toBeDisabled();
    expect(screen.getByLabelText(/^Contraseña/)).toBeDisabled();
    expect(screen.getByLabelText(/^Estado/)).toBeDisabled();

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
