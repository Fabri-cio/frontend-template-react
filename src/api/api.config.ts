import { createApiClient } from "./api-client";

/**
 * ============================================================================
 * API INSTANCE
 * ============================================================================
 *
 * Instancia HTTP principal de la aplicación.
 *
 * La infraestructura genérica vive en `api-client.ts`.
 * Este archivo únicamente define la configuración específica
 * de este proyecto.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = createApiClient({
  /**
   * URL base del backend.
   *
   * Ejemplo:
   * VITE_API_BASE_URL=https://api.example.com
   */
  baseURL: API_BASE_URL,

  /**
   * Tiempo máximo de espera por petición.
   */
  timeout: 10_000,

  /**
   * Headers globales.
   *
   * No agregamos Content-Type aquí porque Axios puede
   * determinarlo automáticamente según el tipo de payload,
   * especialmente para FormData.
   */
  headers: {
    Accept: "application/json",
  },

  /**
   * Autenticación.
   *
   * Por ahora no imponemos ningún sistema.
   *
   * Cuando el proyecto implemente autenticación, podremos
   * configurar:
   *
   * - Bearer Token
   * - JWT
   * - API Key
   * - Headers personalizados
   * - Multi-tenant
   *
   * Ejemplo:
   *
   * auth: {
   *   getToken: () => tokenStorage.getAccessToken(),
   *   scheme: "Bearer",
   * }
   */

  /**
   * Cookies cross-origin.
   *
   * Se cambia a true únicamente si el backend utiliza
   * autenticación basada en cookies/sesiones.
   */
  withCredentials: false,

  /**
   * Manejo específico de respuestas HTTP 401.
   *
   * Este cliente no decide automáticamente hacer logout
   * ni navegar a una ruta.
   *
   * Esa lógica pertenece a la capa de autenticación
   * de la aplicación.
   */
  onUnauthorized: (error) => {
    if (import.meta.env.DEV) {
      console.warn("[API] Unauthorized:", {
        code: error.code,
        message: error.message,
      });
    }
  },

  /**
   * Observador global de errores.
   *
   * No mostramos toasts aquí.
   * No navegamos aquí.
   *
   * La infraestructura HTTP solamente informa del error.
   * La capa superior decide cómo reaccionar.
   */
  onError: (error) => {
    if (import.meta.env.DEV) {
      console.error("[API] Error:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }
  },
});
