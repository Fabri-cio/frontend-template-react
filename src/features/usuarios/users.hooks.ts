import { useApiMutation } from "../../hooks/use.api.mutation";
import { useApiQuery } from "../../hooks/use.api.query";

import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListParams,
  UserListResponse,
} from "./users.types";
import { usersApi } from "./users.api";
import type { AppError } from "../../app/errors/app-error";

/**
 * Obtiene la lista paginada de usuarios.
 */
export function useUsers(params?: UserListParams) {
  return useApiQuery<UserListResponse>({
    queryKey: ["users", "list", params],
    queryFn: () => usersApi.list(params),
  });
}

/**
 * Obtiene un usuario por su identificador.
 */
export function useUser(id: number) {
  return useApiQuery<User>({
    queryKey: ["users", "detail", id],
    queryFn: () => usersApi.getOne(id),
    enabled: Number.isFinite(id),
  });
}

/**
 * Crea un usuario.
 */
export function useCreateUser() {
  return useApiMutation<User, AppError, CreateUserInput>({
    mutationFn: (data) => usersApi.create(data),
  });
}

/**
 * Actualiza un usuario.
 */
export function useUpdateUser() {
  return useApiMutation<
    User,
    AppError,
    { id: number; data: UpdateUserInput }
  >({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
  });
}

/**
 * Elimina un usuario.
 */
export function useDeleteUser() {
  return useApiMutation<unknown, AppError, number>({
    mutationFn: (id) => usersApi.delete(id),
  });
}