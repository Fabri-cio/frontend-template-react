import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "../../hooks/use.api.mutation";
import { useApiQuery } from "../../hooks/use.api.query";

import type { AppError } from "../../app/errors/app-error";

import { produccionApi } from "./produccion.api";

import type {
  CreateProduccionOperacionInput,
  ProduccionOperacion,
  ProduccionOperacionListParams,
  ProduccionOperacionListResponse,
  RegistrarMermaInput,
  RegistrarProduccionInput,
  UpdateProduccionOperacionInput,
} from "./produccion.types";

/**
 * ============================================================================
 * LISTADO
 * ============================================================================
 *
 * Obtiene las operaciones de producción.
 *
 * Los parámetros forman parte del `queryKey` para que cada combinación
 * de filtros/paginación tenga su propia entrada en la caché.
 */
export function useProduccionOperaciones(
  params?: ProduccionOperacionListParams,
) {
  return useApiQuery<ProduccionOperacionListResponse>({
    queryKey: ["produccion", "operaciones", "list", params],

    queryFn: () => produccionApi.list(params),
  });
}

/**
 * ============================================================================
 * DETALLE
 * ============================================================================
 *
 * Obtiene una operación por ID.
 */
export function useProduccionOperacion(id: number) {
  return useApiQuery<ProduccionOperacion>({
    queryKey: ["produccion", "operaciones", "detail", id],

    queryFn: () => produccionApi.getOne(id),

    enabled: Number.isFinite(id),
  });
}

/**
 * ============================================================================
 * CREAR
 * ============================================================================
 *
 * Disponible porque ProduccionOperacion utiliza ModelViewSet.
 *
 * El flujo normal del negocio puede utilizar servicios específicos para crear
 * la ruta y sus operaciones, pero mantenemos el CRUD porque el backend
 * explícitamente lo expone.
 */
export function useCreateProduccionOperacion() {
  const queryClient = useQueryClient();

  return useApiMutation<
    ProduccionOperacion,
    AppError,
    CreateProduccionOperacionInput
  >({
    mutationFn: (data) => produccionApi.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["produccion", "operaciones"],
      });
    },
  });
}

/**
 * ============================================================================
 * ACTUALIZAR
 * ============================================================================
 */
export function useUpdateProduccionOperacion() {
  const queryClient = useQueryClient();

  return useApiMutation<
    ProduccionOperacion,
    AppError,
    {
      id: number;
      data: UpdateProduccionOperacionInput;
    }
  >({
    mutationFn: ({ id, data }) => produccionApi.update(id, data),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", variables.id],
        }),
      ]);
    },
  });
}

/**
 * ============================================================================
 * ELIMINAR
 * ============================================================================
 */
export function useDeleteProduccionOperacion() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, AppError, number>({
    mutationFn: (id) => produccionApi.delete(id),

    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", id],
        }),
      ]);
    },
  });
}

/**
 * ============================================================================
 * INICIAR
 * ============================================================================
 *
 * Utiliza el comando real del backend.
 */
export function useIniciarProduccionOperacion() {
  const queryClient = useQueryClient();

  return useApiMutation<ProduccionOperacion, AppError, number>({
    mutationFn: (id) => produccionApi.iniciar(id),

    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", id],
        }),
      ]);
    },
  });
}

/**
 * ============================================================================
 * REGISTRAR PRODUCCIÓN
 * ============================================================================
 */
export function useRegistrarProduccion() {
  const queryClient = useQueryClient();

  return useApiMutation<
    unknown,
    AppError,
    {
      id: number;
      data: RegistrarProduccionInput;
    }
  >({
    mutationFn: ({ id, data }) => produccionApi.registrarProduccion(id, data),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", variables.id],
        }),
      ]);
    },
  });
}

/**
 * ============================================================================
 * REGISTRAR MERMA
 * ============================================================================
 */
export function useRegistrarMerma() {
  const queryClient = useQueryClient();

  return useApiMutation<
    unknown,
    AppError,
    {
      id: number;
      data: RegistrarMermaInput;
    }
  >({
    mutationFn: ({ id, data }) => produccionApi.registrarMerma(id, data),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", variables.id],
        }),
      ]);
    },
  });
}

/**
 * ============================================================================
 * FINALIZAR
 * ============================================================================
 *
 * Utiliza el comando real:
 *
 * POST /producciones-operaciones/{id}/finalizar/
 */
export function useFinalizarProduccionOperacion() {
  const queryClient = useQueryClient();

  return useApiMutation<ProduccionOperacion, AppError, number>({
    mutationFn: (id) => produccionApi.finalizar(id),

    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["produccion", "operaciones", "detail", id],
        }),
      ]);
    },
  });
}
