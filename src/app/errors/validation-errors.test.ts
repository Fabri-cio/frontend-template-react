import { describe, expect, it } from "vitest";

import { AppError } from "./app-error";
import { getValidationFieldErrors } from "./validation-errors";

describe("getValidationFieldErrors", () => {
  it("convierte arrays de mensajes en mensajes por campo", () => {
    const error = new AppError("VALIDATION_ERROR", "Error de validación", {
      details: {
        username: ["El usuario ya existe."],
        email: ["El correo ya está registrado."],
      },
    });

    expect(getValidationFieldErrors(error)).toEqual({
      username: "El usuario ya existe.",
      email: "El correo ya está registrado.",
    });
  });

  it("acepta mensajes que ya vienen como string", () => {
    const error = new AppError("VALIDATION_ERROR", "Error de validación", {
      details: {
        username: "El usuario ya existe.",
      },
    });

    expect(getValidationFieldErrors(error)).toEqual({
      username: "El usuario ya existe.",
    });
  });

  it("devuelve un objeto vacío si el error no es de validación", () => {
    const error = new AppError("SERVER_ERROR", "Error interno del servidor", {
      details: {
        username: ["Error inesperado."],
      },
    });

    expect(getValidationFieldErrors(error)).toEqual({});
  });

  it("devuelve un objeto vacío si el valor no es un AppError", () => {
    const error = new Error("Error inesperado");

    expect(getValidationFieldErrors(error)).toEqual({});
  });
});
