import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getValidationFieldErrors } from "../../app/errors/validation-errors";
import {
  Button,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../components/ui";
import type { FormFieldErrors } from "../../components/ui/form";

import UserForm from "./UserForm";
import { useCreateUser } from "./users.hooks";

import type { UserFormValues } from "./UserForm";
import type { CreateUserInput } from "./users.types";

import { AppError } from "../../app/errors/app-error";
import { showAppErrorToast, useToast } from "../../components/ui";

/**
 * Página para crear un nuevo usuario.
 *
 * La página se encarga de:
 *
 * - conectar el formulario con la mutación de creación;
 * - solicitar confirmación antes de crear el usuario;
 * - gestionar la navegación.
 *
 * Los componentes de UI utilizados son genéricos
 * y no contienen lógica específica de usuarios.
 */
export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const toast = useToast();

  const [pendingValues, setPendingValues] = useState<UserFormValues | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  const isConfirmOpen = pendingValues !== null;

  function handleSubmit(values: UserFormValues) {
    setFieldErrors({});
    setPendingValues(values);
  }

  function handleCancel() {
    navigate("/users");
  }

  function handleCloseConfirmation() {
    if (createUser.isPending) {
      return;
    }

    setPendingValues(null);
  }

  async function handleConfirmCreate() {
    if (!pendingValues || createUser.isPending) {
      return;
    }

    const data: CreateUserInput = {
      username: pendingValues.username,
      email: pendingValues.email,
      password: pendingValues.password,
      first_name: pendingValues.first_name || undefined,
      last_name: pendingValues.last_name || undefined,
      is_active: pendingValues.is_active,
    };

    try {
      await createUser.mutateAsync(data);

      // toast
      toast.showToast({
        variant: "success",
        title: "Usuario creado",
        children: "El usuario se creó correctamente.",
      });

      setPendingValues(null);
      navigate("/users");
    } catch (error) {
      const errors = getValidationFieldErrors(error);

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
      } else if (error instanceof AppError) {
        showAppErrorToast(toast, error);
      }

      setPendingValues(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear usuario
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos para crear un nuevo usuario.
          </p>
        </div>

        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createUser.isPending}
          submitLabel="Crear usuario"
          fieldErrors={fieldErrors}
        />
      </div>

      <Modal
        open={isConfirmOpen}
        onClose={handleCloseConfirmation}
        closeOnBackdrop={!createUser.isPending}
        closeOnEscape={!createUser.isPending}
      >
        <ModalHeader>
          <ModalTitle>Confirmar creación</ModalTitle>

          <ModalDescription>
            ¿Deseas crear este usuario con la siguiente información?
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          {pendingValues ? (
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="font-medium text-muted-foreground">Usuario</dt>

                <dd className="text-foreground">{pendingValues.username}</dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="font-medium text-muted-foreground">
                  Correo electrónico
                </dt>

                <dd className="text-foreground">{pendingValues.email}</dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="font-medium text-muted-foreground">Nombre</dt>

                <dd className="text-foreground">
                  {pendingValues.first_name || "—"}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="font-medium text-muted-foreground">Apellido</dt>

                <dd className="text-foreground">
                  {pendingValues.last_name || "—"}
                </dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="font-medium text-muted-foreground">Estado</dt>

                <dd className="text-foreground">
                  {pendingValues.is_active ? "Activo" : "Inactivo"}
                </dd>
              </div>
            </dl>
          ) : null}
        </ModalContent>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseConfirmation}
            disabled={createUser.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleConfirmCreate}
            disabled={createUser.isPending}
          >
            {createUser.isPending ? "Creando..." : "Sí, crear"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
