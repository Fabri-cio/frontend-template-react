import type {
  ApiClient,
  CrudListParams,
  CrudOperations,
  CrudUpdateMethod,
  EntityId,
} from "./api.types";

interface CrudOptions {
  /**
   * Método HTTP utilizado para actualizar.
   *
   * Por defecto:
   * PUT
   *
   * Puede cambiarse a:
   * PATCH
   */
  updateMethod?: CrudUpdateMethod;

  /**
   * Indica si las rutas del recurso deben terminar
   * en `/`.
   *
   * Por defecto:
   * false
   *
   * Ejemplo:
   * "usuarios" + true  -> /usuarios/
   * "usuarios" + false -> /usuarios
   */
  trailingSlash?: boolean;
}

/**
 * ===========================================================================
 * CRUD FACTORY
 * ===========================================================================
 */

/**
 * Crea operaciones CRUD genéricas para un recurso.
 *
 * IMPORTANTE:
 *
 * Esta función NO asume:
 *
 * - qué backend utilizamos
 * - qué estructura tiene la respuesta
 * - qué sistema de autenticación existe
 * - cómo funciona la paginación
 * - que el listado devuelve un array
 *
 * Todo eso lo determina el módulo API específico.
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
  /**
   * Normaliza el resource para evitar problemas
   * con "/" al principio o al final.
   *
   * Ejemplos:
   *
   * "usuarios"     -> "usuarios"
   * "/usuarios"    -> "usuarios"
   * "usuarios/"    -> "usuarios"
   * "/usuarios/"   -> "usuarios"
   */
  const normalizedResource = resource.replace(/^\/+|\/+$/g, "");

  const updateMethod = options.updateMethod ?? "PUT";

  const trailingSlash = options.trailingSlash ?? false;

  const buildResourceUrl = (path = ""): string => {
    const suffix = trailingSlash ? "/" : "";

    if (!path) {
      return `/${normalizedResource}${suffix}`;
    }

    return `/${normalizedResource}/${path}${suffix}`;
  };

  return {
    /**
     * ========================================================================
     * GET LIST filtered
     * ========================================================================
     */
    list: async (params?: TParams): Promise<TListResponse> => {
      return api.get<TListResponse>(buildResourceUrl(), {
        params,
      });
    },

    /**
     * ========================================================================
     * GET ONE
     * ========================================================================
     */
    getOne: async (id: EntityId): Promise<TEntity> => {
      return api.get<TEntity>(buildResourceUrl(encodeURIComponent(String(id))));
    },

    /**
     * ========================================================================
     * CREATE
     * ========================================================================
     */
    create: async (data: TCreate): Promise<TEntity> => {
      return api.post<TEntity, TCreate>(buildResourceUrl(), data);
    },

    /**
     * ========================================================================
     * UPDATE
     * ========================================================================
     */
    update: async (id: EntityId, data: TUpdate): Promise<TEntity> => {
      const url = buildResourceUrl(encodeURIComponent(String(id)));

      if (updateMethod === "PATCH") {
        return api.patch<TEntity, TUpdate>(url, data);
      }

      return api.put<TEntity, TUpdate>(url, data);
    },

    /**
     * ========================================================================
     * DELETE
     * ========================================================================
     */
    delete: async (id: EntityId): Promise<TDeleteResponse> => {
      return api.delete<TDeleteResponse>(
        buildResourceUrl(encodeURIComponent(String(id))),
      );
    },
  };
};
