import type { AppError, AppErrorCode } from "./app-error";

export interface ErrorPresentation {
  title: string;
  message: string;
}

const ERROR_PRESENTATIONS: Record<
  Exclude<AppErrorCode, "VALIDATION_ERROR">,
  ErrorPresentation
> = {
  NETWORK_ERROR: {
    title: "Error de conexión",
    message: "No se pudo conectar con el servidor.",
  },

  UNAUTHORIZED: {
    title: "Sesión no válida",
    message: "Tu sesión no es válida o ha expirado.",
  },

  FORBIDDEN: {
    title: "Acceso denegado",
    message: "No tienes permisos para realizar esta acción.",
  },

  NOT_FOUND: {
    title: "No encontrado",
    message: "No se encontró el recurso solicitado.",
  },

  SERVER_ERROR: {
    title: "Error del servidor",
    message: "Ocurrió un error en el servidor.",
  },

  UNKNOWN_ERROR: {
    title: "Error inesperado",
    message: "Ocurrió un error inesperado.",
  },
};

export function getErrorPresentation(
  error: AppError,
): ErrorPresentation | null {
  if (error.code === "VALIDATION_ERROR") {
    return null;
  }

  return ERROR_PRESENTATIONS[error.code];
}
