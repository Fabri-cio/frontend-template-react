import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import type { AppError } from "../app/errors/app-error";

/**
 * ============================================================================
 * AUTHENTICATION
 * ============================================================================
 *
 * Configuración opcional de autenticación.
 *
 * Este contrato no asume:
 *
 * - JWT
 * - Bearer
 * - cookies
 * - localStorage
 * - sesiones
 *
 * La aplicación consumidora decide cómo obtener y enviar sus credenciales.
 */

export interface ApiAuthConfig {
  /**
   * Obtiene la credencial actual.
   */
  getToken?: () => string | null | undefined;

  /**
   * Esquema de autenticación.
   *
   * Ejemplos:
   * - Bearer
   * - Token
   * - JWT
   * - Basic
   * - cualquier esquema personalizado
   */
  scheme?: string;

  /**
   * Nombre del header donde se enviará la credencial.
   *
   * Por defecto:
   * Authorization
   */
  headerName?: string;

  /**
   * Permite generar headers dinámicos personalizados.
   *
   * Útil para:
   * - API keys
   * - tenant IDs
   * - headers personalizados
   * - múltiples credenciales
   */
  getHeaders?: () => Record<string, string>;
}

/**
 * ============================================================================
 * RESPONSE
 * ============================================================================
 *
 * Representa la información HTTP de una respuesta exitosa.
 *
 * No impone ningún envelope específico al payload.
 *
 * El backend puede devolver:
 *
 * - un objeto
 * - un array
 * - un string
 * - un número
 * - null
 * - cualquier otra estructura
 */

export interface ApiResponse<TData = unknown> {
  data: TData;
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
}

/**
 * ============================================================================
 * REQUEST
 * ============================================================================
 */

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

/**
 * Valores permitidos para parámetros de consulta.
 *
 * No asumimos nombres concretos como:
 *
 * - page
 * - limit
 * - offset
 * - search
 * - ordering
 *
 * Cada feature puede definir sus propios parámetros.
 */

export type ApiQueryParamValue = string | number | boolean | null | undefined;

export type ApiQueryParams = Record<
  string,
  ApiQueryParamValue | ApiQueryParamValue[]
>;

export interface ApiRequestOptions<TData = unknown> {
  method: HttpMethod;
  url: string;
  data?: TData;
  params?: ApiQueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  config?: AxiosRequestConfig;
}

/**
 * ============================================================================
 * CLIENT OPTIONS
 * ============================================================================
 */

export interface ApiClientOptions {
  /**
   * URL base del servicio.
   */
  baseURL?: string;

  /**
   * Timeout de las peticiones en milisegundos.
   */
  timeout?: number;

  /**
   * Headers globales.
   */
  headers?: Record<string, string>;

  /**
   * Configuración opcional de autenticación.
   */
  auth?: ApiAuthConfig;

  /**
   * Permite utilizar cookies en peticiones cross-origin.
   */
  withCredentials?: boolean;

  /**
   * Permite modificar la configuración antes de enviar una petición.
   */
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | void;

  /**
   * Observa una respuesta exitosa.
   *
   * No reemplaza ni transforma la respuesta.
   */
  onResponse?: <T>(response: AxiosResponse<T>) => void;

  /**
   * Se ejecuta ante cualquier error normalizado de la API.
   *
   * La aplicación recibe el contrato genérico `AppError`,
   * independientemente de que el error original provenga de Axios,
   * Fetch o cualquier otra implementación.
   */
  onError?: (error: AppError) => void;

  /**
   * Se ejecuta específicamente cuando la API responde HTTP 401.
   *
   * La aplicación decide qué hacer:
   *
   * - logout
   * - refresh token
   * - redirect
   * - mostrar una pantalla
   * - etc.
   */
  onUnauthorized?: (error: AppError) => void;

  /**
   * Permite utilizar opciones específicas de Axios
   * sin limitar nuestra abstracción.
   *
   * Es un escape hatch deliberado para casos avanzados.
   */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * ============================================================================
 * API CLIENT
 * ============================================================================
 */

export interface ApiClient {
  /**
   * Instancia Axios subyacente.
   *
   * Disponible para casos avanzados.
   */
  instance: AxiosInstance;

  /**
   * Ejecuta una petición y devuelve únicamente el payload.
   */
  request<TResponse = unknown, TData = unknown>(
    options: ApiRequestOptions<TData>,
  ): Promise<TResponse>;

  /**
   * Ejecuta una petición y devuelve también
   * información HTTP de la respuesta.
   */
  requestResponse<TResponse = unknown, TData = unknown>(
    options: ApiRequestOptions<TData>,
  ): Promise<ApiResponse<TResponse>>;

  /**
   * HTTP GET.
   */
  get<TResponse = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * HTTP POST.
   */
  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * HTTP PUT.
   */
  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * HTTP PATCH.
   */
  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * HTTP DELETE.
   */
  delete<TResponse = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;
}

/**
 * ============================================================================
 * CRUD
 * ============================================================================
 */

export type EntityId = string | number;

export type CrudUpdateMethod = "PUT" | "PATCH";

/**
 * Parámetros genéricos de una colección.
 *
 * No asumimos:
 *
 * - page
 * - limit
 * - offset
 * - search
 * - ordering
 * - filtros específicos
 */
export type CrudListParams = ApiQueryParams;

/**
 * Contrato de operaciones CRUD genéricas.
 *
 * No asumimos que todas las APIs utilicen CRUD.
 * Esta abstracción es únicamente una utilidad opcional.
 */
export interface CrudOperations<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
  TListResponse = TEntity[],
  TParams extends CrudListParams = CrudListParams,
  TDeleteResponse = void,
> {
  list(params?: TParams): Promise<TListResponse>;

  getOne(id: EntityId): Promise<TEntity>;

  create(data: TCreate): Promise<TEntity>;

  update(id: EntityId, data: TUpdate): Promise<TEntity>;

  delete(id: EntityId): Promise<TDeleteResponse>;
}
