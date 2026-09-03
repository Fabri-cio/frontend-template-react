import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * ===========================================================================
 * API CLIENT
 * ===========================================================================
 */

/**
 * Esquema de autenticación.
 *
 * Puede utilizar esquemas conocidos:
 * - Bearer
 * - Token
 * - JWT
 * - Basic
 *
 * o cualquier esquema personalizado.
 */
export type AuthScheme = string;

/**
 * Configuración de autenticación.
 *
 * El ApiClient NO sabe dónde se almacena el token.
 * El proyecto consumidor decide cómo obtenerlo.
 */
export interface ApiAuthConfig {
  /**
   * Obtiene la credencial actual.
   *
   * Puede venir de:
   * - localStorage
   * - sessionStorage
   * - Context
   * - Zustand
   * - otra fuente
   *
   * Si se utiliza autenticación por cookies/HttpOnly,
   * puede omitirse.
   */
  getToken?: () => string | null | undefined;

  /**
   * Esquema de autenticación.
   *
   * Ejemplos:
   * Bearer
   * Token
   * JWT
   */
  scheme?: AuthScheme;

  /**
   * Header donde se enviará la credencial.
   *
   * Por defecto:
   * Authorization
   *
   * Ejemplos:
   * X-API-Key
   * X-Auth-Token
   */
  headerName?: string;

  /**
   * Permite generar headers personalizados dinámicamente.
   *
   * Útil para:
   * - API keys
   * - Bearer tokens
   * - tenant IDs
   * - versiones de API
   * - múltiples credenciales
   * - cualquier header requerido por el backend
   *
   * Ejemplo:
   *
   * getHeaders: () => ({
   *   Authorization: `Bearer ${getAccessToken()}`,
   *   "X-Tenant-ID": getTenantId(),
   * })
   */
  getHeaders?: () => Record<string, string>;
}

/**
 * ===========================================================================
 * API ERRORS
 * ===========================================================================
 */

/**
 * Categoría general de un error.
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
 * IMPORTANTE:
 *
 * Nunca perdemos el error original de Axios ni la respuesta
 * original enviada por el backend.
 */
export interface ApiError<TData = unknown> extends Error {
  /**
   * Tipo general del error.
   */
  type: ApiErrorType;

  /**
   * Código HTTP cuando existe.
   *
   * Ejemplos:
   * 400
   * 401
   * 403
   * 404
   * 409
   * 422
   * 429
   * 500
   */
  status?: number;

  /**
   * Payload original enviado por el backend.
   *
   * Puede tener cualquier estructura.
   */
  data?: TData;

  /**
   * Headers de la respuesta.
   */
  headers?: Record<string, string>;

  /**
   * Configuración de la petición que produjo el error.
   */
  config?: AxiosRequestConfig;

  /**
   * Error original de Axios.
   */
  originalError?: AxiosError<TData>;
}

/**
 * ===========================================================================
 * API RESPONSE
 * ===========================================================================
 */

/**
 * Representación opcional de una respuesta HTTP.
 *
 * NO es obligatorio que todos los backends utilicen esta estructura.
 *
 * Se puede utilizar cuando una parte de la aplicación necesita
 * trabajar con metadata HTTP además del payload.
 */
export interface ApiResponse<TData = unknown> {
  /**
   * Payload devuelto por el backend.
   */
  data: TData;

  /**
   * Código HTTP.
   */
  status: number;

  /**
   * Texto asociado al status.
   */
  statusText?: string;

  /**
   * Headers de respuesta.
   */
  headers?: Record<string, string>;
}

/**
 * ===========================================================================
 * HTTP REQUEST
 * ===========================================================================
 */

/**
 * Métodos HTTP soportados.
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
 * Valores permitidos para query parameters.
 *
 * Se mantiene flexible para soportar diferentes APIs.
 */
export type ApiQueryParamValue = string | number | boolean | null | undefined;

/**
 * Query parameters.
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   search: "laptop",
 *   active: true
 * }
 *
 * También permite parámetros personalizados.
 */
export type ApiQueryParams = Record<
  string,
  ApiQueryParamValue | ApiQueryParamValue[]
>;

/**
 * Opciones de una petición HTTP.
 */
export interface ApiRequestOptions<TData = unknown> {
  /**
   * Método HTTP.
   */
  method: HttpMethod;

  /**
   * URL relativa o absoluta.
   */
  url: string;

  /**
   * Datos enviados al backend.
   *
   * Puede ser:
   * - JSON
   * - FormData
   * - Blob
   * - File
   * - ArrayBuffer
   * - texto
   * - cualquier otro payload
   */
  data?: TData;

  /**
   * Query parameters.
   */
  params?: ApiQueryParams;

  /**
   * Headers específicos de esta petición.
   *
   * Tienen prioridad sobre los headers globales.
   */
  headers?: Record<string, string>;

  /**
   * Permite cancelar la petición.
   *
   * Compatible con AbortController,
   * React Query y Axios.
   */
  signal?: AbortSignal;

  /**
   * Configuración adicional de Axios.
   *
   * Permite utilizar funcionalidades específicas
   * de Axios sin limitar nuestra abstracción.
   */
  config?: AxiosRequestConfig;
}

/**
 * ===========================================================================
 * API CLIENT OPTIONS
 * ===========================================================================
 */

/**
 * Configuración general del cliente.
 */
export interface ApiClientOptions {
  /**
   * URL base del backend.
   */
  baseURL?: string;

  /**
   * Tiempo máximo de espera de una petición.
   */
  timeout?: number;

  /**
   * Headers globales.
   */
  headers?: Record<string, string>;

  /**
   * Configuración de autenticación.
   */
  auth?: ApiAuthConfig;

  /**
   * Permite enviar cookies automáticamente.
   *
   * Útil para:
   * - sesiones
   * - cookies HttpOnly
   * - CSRF
   * - autenticación basada en cookies
   */
  withCredentials?: boolean;

  /**
   * Se ejecuta antes de enviar una petición.
   *
   * Permite modificar la configuración.
   */
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | void;

  /**
   * Se ejecuta cuando se recibe una respuesta exitosa.
   *
   * No obliga a modificar la respuesta.
   */
  onResponse?: <T>(response: AxiosResponse<T>) => void;

  /**
   * Se ejecuta ante cualquier error.
   */
  onError?: (error: ApiError) => void;

  /**
   * Se ejecuta específicamente ante HTTP 401.
   *
   * El ApiClient NO decide si debe:
   * - hacer logout
   * - renovar token
   * - redirigir
   *
   * Eso lo decide la aplicación.
   */
  onUnauthorized?: (error: ApiError) => void;

  /**
   * Configuración adicional de Axios.
   *
   * Permite casos avanzados sin romper nuestra abstracción.
   */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * ===========================================================================
 * API CLIENT
 * ===========================================================================
 */

/**
 * Contrato público de nuestro cliente HTTP.
 *
 * Aunque actualmente usamos Axios internamente,
 * la aplicación trabaja contra este contrato.
 */
export interface ApiClient {
  /**
   * Instancia interna de Axios.
   *
   * Disponible para casos avanzados.
   */
  instance: AxiosInstance;

  /**
   * Petición HTTP genérica.
   *
   * TResponse:
   * tipo esperado de respuesta.
   *
   * TData:
   * tipo de datos enviados.
   */
  request<TResponse = unknown, TData = unknown>(
    options: ApiRequestOptions<TData>,
  ): Promise<TResponse>;

  /**
   * Petición HTTP que devuelve el payload junto
   * con información de la respuesta HTTP.
   *
   * Útil cuando necesitamos:
   * - status
   * - headers
   * - metadata HTTP
   * - ETag
   * - Location
   * - Content-Disposition
   * - rate limits
   * - etc.
   */
  requestResponse<TResponse = unknown, TData = unknown>(
    options: ApiRequestOptions<TData>,
  ): Promise<ApiResponse<TResponse>>;

  /**
   * GET.
   */
  get<TResponse = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * POST.
   */
  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * PUT.
   */
  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * PATCH.
   */
  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    options?: Omit<ApiRequestOptions, "method" | "url" | "data">,
  ): Promise<TResponse>;

  /**
   * DELETE.
   */
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

/**
 * Identificador genérico de una entidad.
 *
 * Soporta:
 * - números
 * - strings
 * - UUID
 */
export type EntityId = string | number;

/**
 * Método HTTP utilizado para actualizar una entidad
 * mediante las operaciones CRUD genéricas.
 *
 * Algunos backends utilizan PUT y otros PATCH.
 */
export type CrudUpdateMethod = "PUT" | "PATCH";

/**
 * Parámetros genéricos de una colección.
 *
 * No imponemos nombres como:
 * - page
 * - limit
 * - offset
 * - search
 * - ordering
 *
 * Cada API concreta define los parámetros que necesita.
 */
export type CrudListParams = ApiQueryParams;

/**
 * Contrato genérico de operaciones CRUD.
 *
 * TEntity:
 * entidad principal.
 *
 * TCreate:
 * payload utilizado para crear.
 *
 * TUpdate:
 * payload utilizado para actualizar.
 *
 * TListResponse:
 * respuesta completa del endpoint de listado.
 *
 * Esto es importante porque NO asumimos que el backend
 * devuelve directamente TEntity[].
 */
export interface CrudOperations<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
  TListResponse = TEntity[],
  TParams extends CrudListParams = CrudListParams,
  TDeleteResponse = void,
> {
  /**
   * Obtener colección. filtered
   */
  list(params?: TParams): Promise<TListResponse>;

  /**
   * Obtener una entidad.
   */
  getOne(id: EntityId): Promise<TEntity>;

  /**
   * Crear entidad.
   */
  create(data: TCreate): Promise<TEntity>;

  /**
   * Actualizar entidad.
   */
  update(id: EntityId, data: TUpdate): Promise<TEntity>;

  /**
   * Eliminar entidad.
   *
   * Algunos backends devuelven 204 sin contenido.
   * Otros devuelven la entidad eliminada o algún payload.
   */
  delete(id: EntityId): Promise<TDeleteResponse>;
}


