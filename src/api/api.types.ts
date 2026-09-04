import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * ===========================================================================
 * AUTHENTICATION
 * ===========================================================================
 */

export interface ApiAuthConfig {
  /**
   * Obtiene la credencial actual.
   *
   * Puede provenir de cualquier fuente controlada
   * por la aplicación consumidora.
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
   * Header donde se enviará la credencial.
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
 * ===========================================================================
 * ERRORS
 * ===========================================================================
 */

export type ApiErrorType =
  | "http"
  | "network"
  | "timeout"
  | "cancelled"
  | "unknown";

/**
 * Error normalizado por nuestra capa API.
 *
 * Conservamos tanto el payload original del backend
 * como el error original de Axios.
 */
export interface ApiError<TData = unknown> extends Error {
  type: ApiErrorType;
  status?: number;
  data?: TData;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
  originalError?: AxiosError<TData>;
}

/**
 * ===========================================================================
 * RESPONSE
 * ===========================================================================
 */

export interface ApiResponse<TData = unknown> {
  data: TData;
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
}

/**
 * ===========================================================================
 * REQUEST
 * ===========================================================================
 */

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

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
 * ===========================================================================
 * CLIENT OPTIONS
 * ===========================================================================
 */

export interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: ApiAuthConfig;
  withCredentials?: boolean;

  /**
   * Permite modificar la configuración
   * antes de enviar una petición.
   */
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | void;

  /**
   * Observa una respuesta exitosa.
   *
   * No reemplaza ni transforma la respuesta.
   */
  onResponse?: <T>(response: AxiosResponse<T>) => void;

  /**
   * Se ejecuta ante cualquier error.
   */
  onError?: (error: ApiError) => void;

  /**
   * Se ejecuta específicamente ante HTTP 401.
   *
   * La aplicación decide qué hacer:
   * - logout
   * - refresh token
   * - redirect
   * - etc.
   */
  onUnauthorized?: (error: ApiError) => void;

  /**
   * Permite utilizar opciones específicas de Axios
   * sin limitar nuestra abstracción.
   */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * ===========================================================================
 * API CLIENT
 * ===========================================================================
 */

export interface ApiClient {
  /**
   * Instancia Axios subyacente.
   *
   * Disponible para casos avanzados.
   */
  instance: AxiosInstance;

  /**
   * Ejecuta una petición y devuelve únicamente
   * el payload.
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

  get<TResponse = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  delete<TResponse = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;
}

/**
 * ===========================================================================
 * CRUD
 * ===========================================================================
 */

export type EntityId = string | number;

export type CrudUpdateMethod = "PUT" | "PATCH";

/**
 * Parámetros genéricos de una colección.
 *
 * No asumimos:
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
