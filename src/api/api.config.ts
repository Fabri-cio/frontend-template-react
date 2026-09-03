import { createApiClient } from "./api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = createApiClient({
  baseURL: API_BASE_URL,

  timeout: 10_000,

  headers: {
    Accept: "application/json",
  },

  /**
   * Autenticación configurable.
   *
   * Por ahora no asumimos ningún sistema de autenticación.
   *
   * Cuando definamos cómo manejará la aplicación
   * el token/sesión, configuraremos esta parte.
   */
  //   auth: undefined,

  /**
   * Permite autenticación basada en cookies
   * si el backend lo necesita.
   */
  withCredentials: false,

  /**
   * Se ejecuta cuando el backend responde 401.
   *
   * IMPORTANTE:
   *
   * Aquí todavía no hacemos logout ni navegación.
   * Eso lo conectaremos posteriormente con AuthContext
   * o nuestro sistema de autenticación.
   */
  onUnauthorized: (error) => {
    if (import.meta.env.DEV) {
      console.warn("[API] Unauthorized:", error);
    }
  },

  /**
   * Manejo global de errores.
   *
   * No mostramos toast aquí.
   *
   * Los errores de UI pertenecen a React/React Query.
   */
  onError: (error) => {
    if (import.meta.env.DEV) {
      console.error("[API] Error:", error);
    }
  },
});
