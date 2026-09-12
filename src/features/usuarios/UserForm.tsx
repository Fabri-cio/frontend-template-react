import type { FormEvent } from "react";

import { Button, Input, Select } from "../../components/ui";

import { Form, FormActions, FormField } from "../../components/ui/form";
import type { FormFieldErrors } from "../../components/ui/form/form.types";

export interface UserFormValues {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

export interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  passwordRequired?: boolean;
  submitLabel?: string;
  fieldErrors?: FormFieldErrors;
}

/**
 * Formulario reutilizable para crear y editar usuarios.
 *
 * No contiene llamadas a la API ni lógica de navegación.
 * El componente padre es responsable de ejecutar la mutación
 * correspondiente y manejar sus estados.
 */
export function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  passwordRequired = true,
  submitLabel = "Guardar",
  fieldErrors,
}: UserFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: UserFormValues = {
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      is_active: formData.get("is_active") === "true",
    };

    await onSubmit(values);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Usuario"
          htmlFor="username"
          required
          error={fieldErrors?.username}
        >
          <Input
            id="username"
            name="username"
            type="text"
            defaultValue={initialValues?.username ?? ""}
            autoComplete="username"
            required
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Correo electrónico"
          htmlFor="email"
          required
          error={fieldErrors?.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialValues?.email ?? ""}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Nombre"
          htmlFor="first_name"
          error={fieldErrors?.first_name}
        >
          <Input
            id="first_name"
            name="first_name"
            type="text"
            defaultValue={initialValues?.first_name ?? ""}
            autoComplete="given-name"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Apellido"
          htmlFor="last_name"
          error={fieldErrors?.last_name}
        >
          <Input
            id="last_name"
            name="last_name"
            type="text"
            defaultValue={initialValues?.last_name ?? ""}
            autoComplete="family-name"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Contraseña"
          htmlFor="password"
          required={passwordRequired}
          description={
            passwordRequired
              ? "La contraseña es obligatoria."
              : "Deja este campo vacío si no deseas cambiar la contraseña."
          }
          error={fieldErrors?.password}
        >
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue={initialValues?.password ?? ""}
            autoComplete="new-password"
            required={passwordRequired}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Estado"
          htmlFor="is_active"
          required
          error={fieldErrors?.is_active}
        >
          <Select
            id="is_active"
            name="is_active"
            defaultValue={initialValues?.is_active === false ? "false" : "true"}
            required
            disabled={isSubmitting}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </Select>
        </FormField>
      </div>

      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </FormActions>
    </Form>
  );
}

export default UserForm;
