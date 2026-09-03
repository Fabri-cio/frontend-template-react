import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import type {
  ApiAuthConfig,
  ApiClient,
  ApiClientOptions,
  ApiError,
  ApiErrorType,
  ApiRequestOptions,
  ApiResponse,
} from "./api.types";

/**
 * ===========================================================================
 * HELPERS
 * ===========================================================================
 */

/**
 * Determina el tipo de error de nuestra capa API.
 */
const getApiErrorType = (error: AxiosError): ApiErrorType => {
  if (axios.isCancel(error)) {
    return "cancelled";
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "timeout";
  }

  if (error.response) {
    return "http";
  }

  if (error.request) {
    return "network";
  }

  return "unknown";
};

/**
 * Normaliza los headers de Axios a un objeto simple.
 */
const normalizeHeaders = (
  headers: AxiosResponse["headers"] | undefined,
): Record<string, string> | undefined => {
  if (!headers) {
    return undefined;
  }

  const result: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      result[key] = value.join(", ");
      return;
    }

    result[key] = String(value);
  });

  return result;
};

/**
 * ===========================================================================
 * ERROR NORMALIZATION
 * ===========================================================================
 */

/**
 * Convierte cualquier error de Axios en nuestro ApiError.
 *
 * IMPORTANTE:
 *
 * No destruimos el error original.
 * Lo conservamos dentro de `originalError`.
 */
const normalizeApiError = <TData = unknown>(
  error: unknown,
): ApiError<TData> => {
  if (!axios.isAxiosError<TData>(error)) {
    const genericError = new Error(
      error instanceof Error ? error.message : "Error desconocido",
    ) as ApiError<TData>;

    genericError.type = "unknown";

    return genericError;
  }

  const axiosError = error as AxiosError<TData>;

  const apiError = new Error(
    axiosError.message || "Error en la petición",
  ) as ApiError<TData>;

  apiError.name = "ApiError";
  apiError.type = getApiErrorType(axiosError);

  if (axiosError.response) {
    apiError.status = axiosError.response.status;
    apiError.data = axiosError.response.data;
    apiError.headers = normalizeHeaders(axiosError.response.headers);
  }

  apiError.config = axiosError.config;
  apiError.originalError = axiosError;

  return apiError;
};

/**
 * ===========================================================================
 * AUTH
 * ===========================================================================
 */

/**
 * Aplica la autenticación configurada a una petición.
 *
 * El cliente NO sabe si utilizamos:
 *
 * - Bearer
 * - Token
 * - JWT
 * - API Key
 * - X-Auth-Token
 * - esquema personalizado
 */
const applyAuthentication = (
  config: AxiosRequestConfig,
  auth?: ApiAuthConfig,
): void => {
  if (!auth) {
    return;
  }

  const headers = AxiosHeaders.from();

  /**
   * Conservamos los headers que ya tenga la petición.
   */
  if (config.headers) {
    Object.entries(config.headers).forEach(([name, value]) => {
      if (value !== undefined) {
        headers.set(name, String(value));
      }
    });
  }

  /**
   * Headers personalizados de autenticación.
   *
   * Permite utilizar:
   * - API keys
   * - Bearer tokens
   * - tenant IDs
   * - headers personalizados
   * - múltiples credenciales
   */
  if (auth.getHeaders) {
    const customHeaders = auth.getHeaders();

    Object.entries(customHeaders).forEach(([name, value]) => {
      headers.set(name, value);
    });
  }

  /**
   * Autenticación mediante token.
   *
   * Permite esquemas como:
   * - Bearer
   * - Token
   * - JWT
   * - cualquier esquema personalizado
   */
  if (auth.getToken) {
    const token = auth.getToken();

    if (token) {
      const headerName = auth.headerName ?? "Authorization";

      const headerValue = auth.scheme ? `${auth.scheme} ${token}` : token;

      headers.set(headerName, headerValue);
    }
  }

  config.headers = headers;
};

/**
 * ===========================================================================
 * API CLIENT
 * ===========================================================================
 */

export const createApiClient = (options: ApiClientOptions = {}): ApiClient => {
  const {
    baseURL,
    timeout = 10000,
    headers,
    auth,
    withCredentials = false,
    onRequest,
    onResponse,
    onError,
    onUnauthorized,
    axiosConfig,
  } = options;

  /**
   * Determina si estamos en desarrollo.
   */
  const isDev = import.meta.env.DEV;

  /**
   * Configuración inicial de Axios.
   */
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers,
    withCredentials,
    ...axiosConfig,
  });

  /**
   * ========================================================================
   * REQUEST INTERCEPTOR
   * ========================================================================
   */
  instance.interceptors.request.use(
    (config) => {
      /**
       * Aplicamos autenticación.
       */
      applyAuthentication(config, auth);

      /**
       * Hook configurable antes de enviar la petición.
       */
      const modifiedConfig = onRequest?.(config);

      if (modifiedConfig) {
        Object.assign(config, modifiedConfig);

        if (modifiedConfig.headers) {
          const headers = AxiosHeaders.from(config.headers);

          Object.entries(modifiedConfig.headers).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              headers.set(key, value);
            }
          });

          config.headers = headers;
        }
      }

      /**
       * Logging únicamente en desarrollo.
       */
      if (isDev) {
        console.debug(
          "[API] Request:",
          config.method?.toUpperCase(),
          config.url,
          config.params ?? "",
          //   config.data ?? "",
        );
      }

      return config;
    },
    (error) => {
      const apiError = normalizeApiError(error);

      if (isDev) {
        console.error("[API] Request Error:", apiError);
      }

      onError?.(apiError);

      return Promise.reject(apiError);
    },
  );

  /**
   * ========================================================================
   * RESPONSE INTERCEPTOR
   * ========================================================================
   */
  instance.interceptors.response.use(
    (response) => {
      /**
       * Hook configurable después de recibir la respuesta.
       */
      onResponse?.(response);

      /**
       * Logging únicamente en desarrollo.
       */
      if (isDev) {
        console.debug(
          "[API] Response:",
          response.status,
          response.config.url,
          response.data,
        );
      }

      return response;
    },

    (error: unknown) => {
      const apiError = normalizeApiError(error);

      if (isDev) {
        console.error("[API] Response Error:", {
          type: apiError.type,
          status: apiError.status,
          data: apiError.data,
          message: apiError.message,
        });
      }

      /**
       * 401 configurable.
       *
       * El ApiClient no hace logout ni redirecciona.
       */
      if (apiError.status === 401) {
        onUnauthorized?.(apiError);
      }

      /**
       * Hook general de errores.
       */
      onError?.(apiError);

      return Promise.reject(apiError);
    },
  );

  /**
   * ===========================================================================
   * REQUEST
   * ===========================================================================
   */

  /**
   * Ejecuta una petición HTTP y devuelve la respuesta completa de Axios.
   *
   * Este método es interno al cliente.
   *
   * Permite reutilizar exactamente la misma configuración
   * para `request()` y `requestResponse()`.
   */
  const executeRequest = async <TResponse = unknown, TData = unknown>(
    requestOptions: ApiRequestOptions<TData>,
  ): Promise<AxiosResponse<TResponse>> => {
    const {
      method,
      url,
      data,
      params,
      headers: requestHeaders,
      signal,
      config = {},
    } = requestOptions;

    const axiosRequestConfig: AxiosRequestConfig = {
      ...config,

      method,
      url,

      /**
       * Los valores específicos de la petición
       * tienen prioridad.
       */
      data,
      params,
      signal,

      headers: {
        ...(config.headers ?? {}),
        ...(requestHeaders ?? {}),
      },
    };

    return instance.request<TResponse>(axiosRequestConfig);
  };

  /**
   * Ejecuta una petición HTTP y devuelve únicamente
   * el payload de la respuesta.
   */
  const request = async <TResponse = unknown, TData = unknown>(
    requestOptions: ApiRequestOptions<TData>,
  ): Promise<TResponse> => {
    const response = await executeRequest<TResponse, TData>(requestOptions);

    return response.data;
  };

  /**
   * Ejecuta una petición HTTP y devuelve:
   *
   * - data
   * - status
   * - statusText
   * - headers
   */
  const requestResponse = async <TResponse = unknown, TData = unknown>(
    requestOptions: ApiRequestOptions<TData>,
  ): Promise<ApiResponse<TResponse>> => {
    const response = await executeRequest<TResponse, TData>(requestOptions);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: normalizeHeaders(response.headers),
    };
  };

  /**
   * ========================================================================
   * HTTP METHODS
   * ========================================================================
   */

  const get = async <TResponse = unknown>(
    url: string,
    requestOptions: Omit<ApiRequestOptions, "method" | "url" | "data"> = {},
  ): Promise<TResponse> => {
    return request<TResponse>({
      ...requestOptions,
      method: "GET",
      url,
    });
  };

  const post = async <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    requestOptions: Omit<ApiRequestOptions, "method" | "url" | "data"> = {},
  ): Promise<TResponse> => {
    return request<TResponse, TData>({
      ...requestOptions,
      method: "POST",
      url,
      data,
    });
  };

  const put = async <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    requestOptions: Omit<ApiRequestOptions, "method" | "url" | "data"> = {},
  ): Promise<TResponse> => {
    return request<TResponse, TData>({
      ...requestOptions,
      method: "PUT",
      url,
      data,
    });
  };

  const patch = async <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    requestOptions: Omit<ApiRequestOptions, "method" | "url" | "data"> = {},
  ): Promise<TResponse> => {
    return request<TResponse, TData>({
      ...requestOptions,
      method: "PATCH",
      url,
      data,
    });
  };

  const deleteRequest = async <TResponse = unknown>(
    url: string,
    requestOptions: Omit<ApiRequestOptions, "method" | "url" | "data"> = {},
  ): Promise<TResponse> => {
    return request<TResponse>({
      ...requestOptions,
      method: "DELETE",
      url,
    });
  };

  /**
   * ========================================================================
   * PUBLIC CLIENT
   * ========================================================================
   */

  const apiClient: ApiClient = {
    instance,
    request,
    requestResponse,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
  };

  return apiClient;
};
