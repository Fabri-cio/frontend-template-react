import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { AppError } from "../../../app/errors/app-error";
import { getValidationFieldErrors } from "../../../app/errors/validation-errors";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
  Tabs,
  showAppErrorToast,
  useToast,
  Input,
  Checkbox,
} from "../../../components/ui";
import type { FormFieldErrors } from "../../../components/ui/form";

import UserForm from "./UserForm";
import type { UserFormValues } from "./UserForm";
import type { UpdateUserInput } from "./users.types";
import { useUpdateUser, useUser } from "./users.hooks";

interface UserEditNavigationState {
  from?: string;
}

type UserDetailTab =
  | "information"
  | "roles"
  | "permissions"
  | "effective-permissions";

export default function UserEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const navigationState = location.state as UserEditNavigationState | null;

  const returnUrl = navigationState?.from ?? "/users";

  const userId = Number(id);
  const userQuery = useUser(userId);
  const updateUser = useUpdateUser();

  const [activeTab, setActiveTab] = useState<UserDetailTab>("information");

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
    navigate(returnUrl);
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
      navigate(returnUrl);
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
        <PageHeader
          title="Usuario"
          description="Cargando información del usuario..."
        />

        <div
          role="status"
          className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm"
        >
          Cargando información...
        </div>
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Usuario"
          description="No fue posible cargar la información del usuario."
          actions={
            <Button type="button" variant="outline" onClick={handleCancel}>
              Volver
            </Button>
          }
        />

        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {userQuery.error instanceof Error
            ? userQuery.error.message
            : "No se pudo cargar el usuario."}
        </div>
      </div>
    );
  }

  const user = userQuery.data;

  const displayName =
    `${user.first_name} ${user.last_name}`.trim() || user.username;

  const tabs = [
    {
      value: "information" as const,
      label: "Información",
    },
    {
      value: "roles" as const,
      label: "Roles",
    },
    {
      value: "permissions" as const,
      label: "Permisos",
    },
    {
      value: "effective-permissions" as const,
      label: "Permisos efectivos",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={`Usuario: ${displayName}`}
          description={`Gestiona la información y los accesos de ${user.username}.`}
          actions={
            <Button type="button" variant="outline" onClick={handleCancel}>
              Volver
            </Button>
          }
        />

        {/* Resumen del usuario */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <Avatar
                  name={displayName}
                  size="lg"
                  alt={`Avatar de ${displayName}`}
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {displayName}
                    </h2>

                    {user.is_active ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    @{user.username}
                  </p>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:min-w-[320px]">
                <div>
                  <p className="text-muted-foreground">Último acceso</p>

                  <p className="mt-1 font-medium text-foreground">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "Nunca"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Fecha de registro</p>

                  <p className="mt-1 font-medium text-foreground">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegación interna del usuario */}
        <Tabs value={activeTab} items={tabs} onChange={setActiveTab} />

        {/* Información */}
        {activeTab === "information" && (
          <Card>
            <CardHeader>
              <CardTitle>Información del usuario</CardTitle>

              <CardDescription>
                Modifica los datos básicos y el estado de la cuenta.
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                showPassword={false}
                submitLabel="Guardar cambios"
                fieldErrors={fieldErrors}
              />
            </CardContent>
          </Card>
        )}

        {/* Roles */}
        {activeTab === "roles" && (
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>

              <CardDescription>
                Asigna los roles que tendrá este usuario.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="max-w-md">
                <label
                  htmlFor="role-search"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Buscar rol
                </label>

                <Input
                  id="role-search"
                  type="search"
                  placeholder="Buscar roles..."
                />
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <div className="divide-y divide-border">
                  {["Administrador", "Supervisor", "Operador", "Calidad"].map(
                    (role) => (
                      <label
                        key={role}
                        className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-accent"
                      >
                        <Checkbox />

                        <span className="text-sm font-medium text-foreground">
                          {role}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  2 roles seleccionados
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="button" variant="outline">
                    Restablecer
                  </Button>

                  <Button type="button">Guardar cambios</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permisos */}
        {activeTab === "permissions" && (
          <Card>
            <CardHeader>
              <CardTitle>Permisos</CardTitle>

              <CardDescription>
                Gestiona los permisos directos asignados a este usuario.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Búsqueda */}
              <div className="max-w-md">
                <label
                  htmlFor="permission-search"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Buscar permiso
                </label>

                <Input
                  id="permission-search"
                  type="search"
                  placeholder="Buscar por nombre o código..."
                />
              </div>

              {/* Grupo: Usuarios */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Usuarios
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Permisos relacionados con la gestión de usuarios.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="divide-y divide-border">
                    {[
                      {
                        name: "Ver usuarios",
                        codename: "usuarios.view_usuario",
                        checked: true,
                      },
                      {
                        name: "Crear usuarios",
                        codename: "usuarios.add_usuario",
                        checked: true,
                      },
                      {
                        name: "Editar usuarios",
                        codename: "usuarios.change_usuario",
                        checked: false,
                      },
                      {
                        name: "Eliminar usuarios",
                        codename: "usuarios.delete_usuario",
                        checked: false,
                      },
                    ].map((permission) => (
                      <label
                        key={permission.codename}
                        className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-accent"
                      >
                        <Checkbox
                          defaultChecked={permission.checked}
                          className="mt-0.5"
                        />

                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">
                            {permission.name}
                          </span>

                          <span className="mt-1 block break-all text-xs text-muted-foreground">
                            {permission.codename}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Grupo: Producción */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Producción
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Permisos relacionados con la gestión de producción.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="divide-y divide-border">
                    {[
                      {
                        name: "Ver operaciones",
                        codename: "produccion.view_produccionoperacion",
                        checked: true,
                      },
                      {
                        name: "Crear operaciones",
                        codename: "produccion.add_produccionoperacion",
                        checked: false,
                      },
                      {
                        name: "Editar operaciones",
                        codename: "produccion.change_produccionoperacion",
                        checked: true,
                      },
                      {
                        name: "Eliminar operaciones",
                        codename: "produccion.delete_produccionoperacion",
                        checked: false,
                      },
                    ].map((permission) => (
                      <label
                        key={permission.codename}
                        className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-accent"
                      >
                        <Checkbox
                          defaultChecked={permission.checked}
                          className="mt-0.5"
                        />

                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">
                            {permission.name}
                          </span>

                          <span className="mt-1 block break-all text-xs text-muted-foreground">
                            {permission.codename}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Acciones */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  3 permisos seleccionados
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="button" variant="outline">
                    Restablecer
                  </Button>

                  <Button type="button">Guardar cambios</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permisos efectivos */}
        {activeTab === "effective-permissions" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Permisos efectivos</CardTitle>

                  <CardDescription>
                    Consulta todos los permisos que este usuario posee,
                    incluidos los heredados por sus roles.
                  </CardDescription>
                </div>

                <Badge variant="info">12 permisos</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Búsqueda */}
              <div className="max-w-md">
                <label
                  htmlFor="effective-permission-search"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Buscar permiso
                </label>

                <Input
                  id="effective-permission-search"
                  type="search"
                  placeholder="Buscar por nombre o código..."
                />
              </div>

              {/* Grupo: Usuarios */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Usuarios
                  </h3>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="divide-y divide-border">
                    {[
                      {
                        name: "Ver usuarios",
                        codename: "usuarios.view_usuario",
                      },
                      {
                        name: "Crear usuarios",
                        codename: "usuarios.add_usuario",
                      },
                      {
                        name: "Editar usuarios",
                        codename: "usuarios.change_usuario",
                      },
                    ].map((permission) => (
                      <div
                        key={permission.codename}
                        className="flex items-start gap-3 p-4"
                      >
                        <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                          <span className="text-[10px] font-bold">✓</span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {permission.name}
                          </p>

                          <p className="mt-1 break-all text-xs text-muted-foreground">
                            {permission.codename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Grupo: Producción */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Producción
                  </h3>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="divide-y divide-border">
                    {[
                      {
                        name: "Ver operaciones",
                        codename: "produccion.view_produccionoperacion",
                      },
                      {
                        name: "Editar operaciones",
                        codename: "produccion.change_produccionoperacion",
                      },
                    ].map((permission) => (
                      <div
                        key={permission.codename}
                        className="flex items-start gap-3 p-4"
                      >
                        <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                          <span className="text-[10px] font-bold">✓</span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {permission.name}
                          </p>

                          <p className="mt-1 break-all text-xs text-muted-foreground">
                            {permission.codename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmación de cambios */}
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
