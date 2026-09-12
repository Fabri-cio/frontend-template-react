import { AppError } from "./app-error";

/**
 * Convierte los detalles de un AppError de validación
 * en un mapa simple de errores por campo.
 *
 * No conoce ninguna feature ni ningún backend concreto.
 */
export function getValidationFieldErrors(
  error: unknown,
): Record<string, string> {
  if (!(error instanceof AppError)) {
    return {};
  }

  if (error.code !== "VALIDATION_ERROR") {
    return {};
  }

  if (
    !error.details ||
    typeof error.details !== "object" ||
    Array.isArray(error.details)
  ) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  for (const [field, value] of Object.entries(error.details)) {
    if (typeof value === "string") {
      fieldErrors[field] = value;
      continue;
    }

    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === "string")
    ) {
      fieldErrors[field] = value.join(" ");
    }
  }

  return fieldErrors;
}
