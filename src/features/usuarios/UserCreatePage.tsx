import { useNavigate } from "react-router-dom";

import { useCreateUser } from "./users.hooks";
import UserForm from "./UserForm";

import type { CreateUserInput } from "./users.types";

/**
 * Página para crear un nuevo usuario.
 *
 * La página se encarga de conectar el formulario
 * con la mutación de creación y de gestionar la navegación.
 *
 * La lógica visual y de captura de datos pertenece a UserForm.
 */
export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  async function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  }) {
    const data: CreateUserInput = {
      username: values.username,
      email: values.email,
      password: values.password,
      first_name: values.first_name || undefined,
      last_name: values.last_name || undefined,
      is_active: values.is_active,
    };

    await createUser.mutateAsync(data);

    navigate("/users");
  }

  function handleCancel() {
    navigate("/users");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crear usuario</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Completa los datos para crear un nuevo usuario.
        </p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createUser.isPending}
        submitLabel="Crear usuario"
      />
    </div>
  );
}
