import { AppError, type AppErrorCode } from "../app/errors/app-error";

/**
 * ============================================================================
 * API ERROR CONTEXT
 * ============================================================================
 *
 * Información opcional proporcionada por la capa de comunicación antes de
 * normalizar un error.
 *
 * Este contrato es deliberadamente independiente de Axios, Fetch y de
 * cualquier cliente HTTP concreto.
 */
export interface ApiErrorContext {
  /**
   * Código de estado HTTP asociado a la respuesta.
   */
  status?: number;

  /**
   * Mensaje normalizado que debe utilizar la aplicación.
   *
   * Si no se proporciona un mensaje válido, se utilizará el mensaje
   * del error original cuando sea posible.
   */
  message?: string;

  /**
   * Información adicional proporcionada por la capa API.
   *
   * La estructura permanece abierta para evitar acoplamiento con un
   * backend específico.
   */
  details?: unknown;
}

/**
 * ============================================================================
 * API ERROR NORMALIZATION
 * ============================================================================
 *
 * Convierte un error originado durante una operación de comunicación en un
 * `AppError`.
 *
 * La función no depende de Axios ni de ningún cliente HTTP concreto.
 *
 * Clasificación utilizada por defecto:
 *
 * - 401 → UNAUTHORIZED
 * - 403 → FORBIDDEN
 * - 404 → NOT_FOUND
 * - 422 → VALIDATION_ERROR
 * - 400 con errores estructurados por campo → VALIDATION_ERROR
 * - 5xx → SERVER_ERROR
 * - sin estado HTTP → NETWORK_ERROR cuando el error es una instancia de Error
 * - cualquier otro caso → UNKNOWN_ERROR
 */
export const normalizeApiError = (
  originalError: unknown,
  context?: ApiErrorContext,
): AppError => {
  /**
   * Si el error ya está normalizado, no lo envolvemos nuevamente.
   *
   * Esto evita perder identidad, código, detalles o causa original.
   */
  if (originalError instanceof AppError) {
    return originalError;
  }

  const status = context?.status;

  const code = getApiErrorCode(originalError, status, context?.details);

  const message =
    getContextMessage(context?.message) ??
    getErrorMessage(originalError) ??
    "Ocurrió un error inesperado.";

  return new AppError(code, message, {
    cause: originalError,
    details: context?.details,
  });
};

/**
 * ============================================================================
 * ERROR CODE
 * ============================================================================
 */

/**
 * Determina el código normalizado correspondiente al error.
 *
 * La clasificación de los errores HTTP se mantiene genérica.
 *
 * Un `400` solamente se considera un error de validación cuando sus detalles
 * tienen una estructura compatible con errores asociados a campos.
 */
const getApiErrorCode = (
  originalError: unknown,
  status?: number,
  details?: unknown,
): AppErrorCode => {
  if (status === 401) {
    return "UNAUTHORIZED";
  }

  if (status === 403) {
    return "FORBIDDEN";
  }

  if (status === 404) {
    return "NOT_FOUND";
  }

  if (status === 422) {
    return "VALIDATION_ERROR";
  }

  if (status === 400 && isFieldValidationDetails(details)) {
    return "VALIDATION_ERROR";
  }

  if (status !== undefined && status >= 500 && status <= 599) {
    return "SERVER_ERROR";
  }

  /**
   * Si no existe un estado HTTP y recibimos un Error nativo, asumimos
   * que pertenece a una categoría de comunicación/red.
   *
   * Esta decisión permanece deliberadamente genérica y podrá refinarse
   * posteriormente en la capa específica del transporte si fuese necesario.
   */
  if (status === undefined && originalError instanceof Error) {
    return "NETWORK_ERROR";
  }

  return "UNKNOWN_ERROR";
};

/**
 * ============================================================================
 * VALIDATION DETAILS
 * ============================================================================
 */

/**
 * Determina si los detalles tienen una estructura compatible con errores
 * de validación asociados a campos.
 *
 * Se aceptan estructuras como:
 *
 * ```ts
 * {
 *   username: ["El usuario ya existe."],
 *   email: ["El correo ya existe."],
 * }
 * ```
 *
 * También se acepta:
 *
 * ```ts
 * {
 *   username: "El usuario ya existe.",
 * }
 * ```
 *
 * La función no depende de un backend específico.
 */
const isFieldValidationDetails = (details: unknown): boolean => {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return false;
  }

  const values = Object.values(details as Record<string, unknown>);

  if (values.length === 0) {
    return false;
  }

  return values.every((value) => {
    if (typeof value === "string") {
      return true;
    }

    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === "string")
    );
  });
};

/**
 * ============================================================================
 * MESSAGE HELPERS
 * ============================================================================
 */

/**
 * Obtiene un mensaje válido proporcionado explícitamente por la capa API.
 *
 * Los mensajes vacíos o compuestos únicamente por espacios se consideran
 * inexistentes.
 */
const getContextMessage = (message: string | undefined): string | undefined => {
  if (message?.trim()) {
    return message;
  }

  return undefined;
};

/**
 * Obtiene un mensaje seguro desde el error original.
 */
const getErrorMessage = (error: unknown): string | undefined => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return undefined;
};
