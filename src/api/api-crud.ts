// El uso de este archivo no es obligatorio, pero es recomendable
import type {
  ApiClient,
  CrudListParams,
  CrudOperations,
  CrudUpdateMethod,
  EntityId,
} from "./api.types";

/**
 * ============================================================================
 * CRUD OPTIONS
 * ============================================================================
 */

export interface CrudOptions {
  /**
   * Método HTTP utilizado para actualizar una entidad.
   *
   * Por defecto: PATCH
   */
  updateMethod?: CrudUpdateMethod;

  /**
   * Indica si las URLs deben terminar con "/".
   *
   * Ejemplo:
   *
   * trailingSlash: false
   * /users
   * /users/123
   *
   * trailingSlash: true
   * /users/
   * /users/123/
   */
  trailingSlash?: boolean;
}

/**
 * ============================================================================
 * URL HELPERS
 * ============================================================================
 */

/**
 * Normaliza el nombre de un recurso.
 *
 * Ejemplos:
 *
 * "users"    -> "users"
 * "/users"   -> "users"
 * "users/"   -> "users"
 * "/users/"  -> "users"
 */
const normalizeResource = (resource: string): string => {
  return resource.replace(/^\/+|\/+$/g, "");
};

/**
 * Crea una función para construir URLs del recurso.
 */
const createResourceUrlBuilder = (resource: string, trailingSlash: boolean) => {
  const normalizedResource = normalizeResource(resource);

  return (path?: string | number): string => {
    const suffix = trailingSlash ? "/" : "";

    if (path === undefined || path === null) {
      return `/${normalizedResource}${suffix}`;
    }

    return `/${normalizedResource}/${encodeURIComponent(
      String(path),
    )}${suffix}`;
  };
};

/**
 * ============================================================================
 * CRUD FACTORY
 * ============================================================================
 */

/**
 * Crea operaciones CRUD convencionales para un recurso REST.
 *
 * IMPORTANTE:
 *
 * Esta utilidad es opcional.
 *
 * Debe utilizarse cuando el backend sigue una estructura convencional:
 *
 * GET    /resource
 * GET    /resource/:id
 * POST   /resource
 * PUT    /resource/:id
 * PATCH  /resource/:id
 * DELETE /resource/:id
 *
 * Para endpoints con comportamientos especiales se recomienda
 * utilizar ApiClient directamente.
 */
export const createCrudOperations = <
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
  TListResponse = TEntity[],
  TParams extends CrudListParams = CrudListParams,
  TDeleteResponse = void,
>(
  api: ApiClient,
  resource: string,
  options: CrudOptions = {},
): CrudOperations<
  TEntity,
  TCreate,
  TUpdate,
  TListResponse,
  TParams,
  TDeleteResponse
> => {
  const { updateMethod = "PATCH", trailingSlash = false } = options;

  const buildUrl = createResourceUrlBuilder(resource, trailingSlash);

  return {
    /**
     * Obtiene una colección.
     */
    list: (params?: TParams) => {
      return api.get<TListResponse>(buildUrl(), {
        params,
      });
    },

    /**
     * Obtiene una entidad por ID.
     */
    getOne: (id: EntityId) => {
      return api.get<TEntity>(buildUrl(id));
    },

    /**
     * Crea una entidad.
     */
    create: (data: TCreate) => {
      return api.post<TEntity, TCreate>(buildUrl(), data);
    },

    /**
     * Actualiza una entidad.
     */
    update: (id: EntityId, data: TUpdate) => {
      const url = buildUrl(id);

      if (updateMethod === "PUT") {
        return api.put<TEntity, TUpdate>(url, data);
      }

      return api.patch<TEntity, TUpdate>(url, data);
    },

    /**
     * Elimina una entidad.
     */
    delete: (id: EntityId) => {
      return api.delete<TDeleteResponse>(buildUrl(id));
    },
  };
};
