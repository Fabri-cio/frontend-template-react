import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import type {
  ApiAuthConfig,
  ApiClient,
  ApiClientOptions,
  ApiRequestOptions,
  ApiResponse,
} from "./api.types";

import { normalizeApiError } from "./api-error";

/**
 * ===========================================================================
 * HELPERS
 * ===========================================================================
 */

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
 * Copia headers de cualquier configuración de Axios
 * hacia AxiosHeaders.
 *
 * Mantenemos esta conversión manual porque Axios permite
 * diferentes representaciones de headers.
 */
const mergeHeaders = (
  ...sources: Array<AxiosRequestConfig["headers"] | undefined>
): AxiosHeaders => {
  const headers = AxiosHeaders.from();

  sources.forEach((source) => {
    if (!source) {
      return;
    }

    Object.entries(source).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        headers.set(name, String(value));
      }
    });
  });

  return headers;
};

/**
 * ===========================================================================
 * AUTHENTICATION
 * ===========================================================================
 */

/**
 * Aplica la autenticación configurada a una petición.
 *
 * El cliente NO sabe qué sistema de autenticación
 * utiliza la aplicación.
 */
const applyAuthentication = (
  config: AxiosRequestConfig,
  auth?: ApiAuthConfig,
): void => {
  if (!auth) {
    return;
  }

  const headers = mergeHeaders(config.headers);

  /**
   * Headers personalizados de autenticación.
   */
  if (auth.getHeaders) {
    const customHeaders = auth.getHeaders();

    Object.entries(customHeaders).forEach(([name, value]) => {
      headers.set(name, value);
    });
  }

  /**
   * Autenticación mediante token.
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
    timeout = 10_000,
    headers,
    auth,
    withCredentials = false,
    onRequest,
    onResponse,
    onError,
    onUnauthorized,
    axiosConfig,
  } = options;

  const isDev = import.meta.env.DEV;

  /**
   * Instancia Axios.
   */
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers,
    withCredentials,
    ...axiosConfig,
  });

  /**
   * =========================================================================
   * REQUEST INTERCEPTOR
   * =========================================================================
   */

  instance.interceptors.request.use(
    (config) => {
      /**
       * Aplicamos autenticación.
       */
      applyAuthentication(config, auth);

      /**
       * Permitimos que la aplicación modifique
       * la configuración antes de enviar la petición.
       */
      const modifiedConfig = onRequest?.(config);

      if (modifiedConfig) {
        Object.assign(config, modifiedConfig);

        if (modifiedConfig.headers) {
          config.headers = mergeHeaders(config.headers, modifiedConfig.headers);
        }
      }

      /**
       * Logging básico únicamente en desarrollo.
       *
       * No mostramos payloads.
       */
      if (isDev) {
        console.debug(
          "[API] Request:",
          config.method?.toUpperCase(),
          config.url,
          config.params ?? "",
        );
      }

      return config;
    },
    (error: unknown) => {
      const apiError = normalizeApiError(error);

      if (isDev) {
        console.error("[API] Request Error:", {
          code: apiError.code,
          message: apiError.message,
        });
      }

      onError?.(apiError);

      return Promise.reject(apiError);
    },
  );

  /**
   * =========================================================================
   * RESPONSE INTERCEPTOR
   * =========================================================================
   */

  instance.interceptors.response.use(
    (response) => {
      /**
       * Observador configurable.
       *
       * No transforma ni reemplaza la respuesta.
       */
      onResponse?.(response);

      /**
       * Logging básico únicamente en desarrollo.
       *
       * No mostramos response.data.
       */
      if (isDev) {
        console.debug("[API] Response:", response.status, response.config.url);
      }

      return response;
    },

    (error: unknown) => {
      /**
       * Extraemos el status HTTP antes de normalizar el error.
       *
       * AppError no depende de HTTP, por lo que el status solamente
       * se utiliza como información de entrada para la normalización.
       */
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      const apiError = normalizeApiError(error, {
        status,
      });

      if (isDev) {
        console.error("[API] Response Error:", {
          code: apiError.code,
          message: apiError.message,
        });
      }

      /**
       * La aplicación decide qué hacer ante un error
       * de autenticación.
       */
      if (apiError.code === "UNAUTHORIZED") {
        onUnauthorized?.(apiError);
      }

      /**
       * Error global.
       */
      onError?.(apiError);

      return Promise.reject(apiError);
    },
  );

  /**
   * =========================================================================
   * REQUEST EXECUTION
   * =========================================================================
   */

  /**
   * Ejecuta una petición HTTP y devuelve
   * la respuesta completa de Axios.
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
      data,
      params,
      signal,

      /**
       * Headers específicos de la petición
       * tienen prioridad sobre los globales.
       */
      headers: mergeHeaders(config.headers, requestHeaders),
    };

    return instance.request<TResponse>(axiosRequestConfig);
  };

  /**
   * Ejecuta una petición HTTP y devuelve
   * únicamente el payload.
   */
  const request = async <TResponse = unknown, TData = unknown>(
    requestOptions: ApiRequestOptions<TData>,
  ): Promise<TResponse> => {
    const response = await executeRequest<TResponse, TData>(requestOptions);

    return response.data;
  };

  /**
   * Ejecuta una petición HTTP y devuelve
   * payload + metadata HTTP.
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
   * =========================================================================
   * HTTP METHODS
   * =========================================================================
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
   * =========================================================================
   * PUBLIC CLIENT
   * =========================================================================
   */

  return {
    instance,
    request,
    requestResponse,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
  };
};
