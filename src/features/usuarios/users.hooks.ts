import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "../../hooks/use.api.mutation";
import { useApiQuery } from "../../hooks/use.api.query";

import type { AppError } from "../../app/errors/app-error";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListParams,
  UserListResponse,
} from "./users.types";
import { usersApi } from "./users.api";

/**
 * Obtiene la lista paginada de usuarios.
 */
export function useUsers(params?: UserListParams) { // ojo es con params 
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
  const queryClient = useQueryClient();

  return useApiMutation<User, AppError, CreateUserInput>({
    mutationFn: (data) => usersApi.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users", "list"],
      });
    },
  });
}

/**
 * Actualiza un usuario.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useApiMutation<User, AppError, { id: number; data: UpdateUserInput }>({
    mutationFn: ({ id, data }) => usersApi.update(id, data),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "detail", variables.id],
        }),
      ]);
    },
  });
}

/**
 * Elimina un usuario.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, AppError, number>({
    mutationFn: (id) => usersApi.delete(id),

    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "detail", id],
        }),
      ]);
    },
  });
}
