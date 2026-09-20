import { describe, expect, it } from "vitest";

import { AppError } from "../app-error";
import { getErrorPresentation } from "../error-presenter";

describe("getErrorPresentation", () => {
  it("presenta un error de conexión", () => {
    const error = new AppError("NETWORK_ERROR", "Error original de conexión");

    expect(getErrorPresentation(error)).toEqual({
      title: "Error de conexión",
      message: "No se pudo conectar con el servidor.",
    });
  });

  it("presenta un error de autenticación", () => {
    const error = new AppError(
      "UNAUTHORIZED",
      "Error original de autenticación",
    );

    expect(getErrorPresentation(error)).toEqual({
      title: "Sesión no válida",
      message: "Tu sesión no es válida o ha expirado.",
    });
  });

  it("presenta un error de permisos", () => {
    const error = new AppError("FORBIDDEN", "Error original de permisos");

    expect(getErrorPresentation(error)).toEqual({
      title: "Acceso denegado",
      message: "No tienes permisos para realizar esta acción.",
    });
  });

  it("presenta un error de recurso no encontrado", () => {
    const error = new AppError("NOT_FOUND", "Error original de recurso");

    expect(getErrorPresentation(error)).toEqual({
      title: "No encontrado",
      message: "No se encontró el recurso solicitado.",
    });
  });

  it("presenta un error del servidor", () => {
    const error = new AppError("SERVER_ERROR", "Error original del servidor");

    expect(getErrorPresentation(error)).toEqual({
      title: "Error del servidor",
      message: "Ocurrió un error en el servidor.",
    });
  });

  it("presenta un error desconocido", () => {
    const error = new AppError("UNKNOWN_ERROR", "Error original desconocido");

    expect(getErrorPresentation(error)).toEqual({
      title: "Error inesperado",
      message: "Ocurrió un error inesperado.",
    });
  });

  it("no genera una presentación para errores de validación", () => {
    const error = new AppError("VALIDATION_ERROR", "Error de validación", {
      details: {
        username: ["Este usuario ya existe."],
      },
    });

    expect(getErrorPresentation(error)).toBeNull();
  });
});
