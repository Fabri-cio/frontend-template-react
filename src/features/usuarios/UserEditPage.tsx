import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppError } from "../../app/errors/app-error";
import { getValidationFieldErrors } from "../../app/errors/validation-errors";
import {
  Button,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  showAppErrorToast,
  useToast,
} from "../../components/ui";
import type { FormFieldErrors } from "../../components/ui/form";

import UserForm from "./UserForm";
import type { UserFormValues } from "./UserForm";
import type { UpdateUserInput } from "./users.types";
import { useUpdateUser, useUser } from "./users.hooks";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const userId = Number(id);
  const userQuery = useUser(userId);
  const updateUser = useUpdateUser();

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
    if (updateUser.isPending) return;
    setPendingValues(null);
  }

  async function handleConfirmUpdate() {
    if (!pendingValues || updateUser.isPending) return;

    const data: UpdateUserInput = {
      username: pendingValues.username,
      email: pendingValues.email,
      first_name: pendingValues.first_name || undefined,
      last_name: pendingValues.last_name || undefined,
      is_active: pendingValues.is_active,
    };

    try {
      await updateUser.mutateAsync({
        id: userId,
        data,
      });

      toast.showToast({
        variant: "success",
        title: "Usuario actualizado",
        children: "El usuario se actualizó correctamente.",
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

  if (userQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar usuario
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cargando información del usuario...
          </p>
        </div>

        <div
          role="status"
          className="rounded-md border p-4 text-sm text-muted-foreground"
        >
          Cargando...
        </div>
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar usuario
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No fue posible cargar la información del usuario.
          </p>
        </div>

        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {userQuery.error instanceof Error
            ? userQuery.error.message
            : "No se pudo cargar el usuario."}
        </div>

        <Button type="button" variant="outline" onClick={handleCancel}>
          Volver
        </Button>
      </div>
    );
  }

  const user = userQuery.data;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar usuario
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modifica los datos del usuario y guarda los cambios.
          </p>
        </div>

        <UserForm
          initialValues={{
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateUser.isPending}
          showPassword={false} //sin contraseña
          submitLabel="Guardar cambios"
          fieldErrors={fieldErrors}
        />
      </div>

      <Modal
        open={isConfirmOpen}
        onClose={handleCloseConfirmation}
        closeOnBackdrop={!updateUser.isPending}
        closeOnEscape={!updateUser.isPending}
      >
        <ModalHeader>
          <ModalTitle>Confirmar cambios</ModalTitle>
          <ModalDescription>
            ¿Deseas guardar los cambios realizados en este usuario?
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
            disabled={updateUser.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleConfirmUpdate}
            disabled={updateUser.isPending}
          >
            {updateUser.isPending ? "Guardando..." : "Sí, guardar cambios"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
