import { describe, expect, it } from "vitest";

import { AppError } from "../app/errors/app-error";

import { normalizeApiError } from "./api-error";

describe("normalizeApiError", () => {
  it("normaliza un error 401 como UNAUTHORIZED", () => {
    const originalError = new Error("Unauthorized");

    const error = normalizeApiError(originalError, {
      status: 401,
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Unauthorized");
    expect(error.cause).toBe(originalError);
  });

  it("normaliza un error 403 como FORBIDDEN", () => {
    const originalError = new Error("Forbidden");

    const error = normalizeApiError(originalError, {
      status: 403,
    });

    expect(error.code).toBe("FORBIDDEN");
  });

  it("normaliza un error 404 como NOT_FOUND", () => {
    const originalError = new Error("Not found");

    const error = normalizeApiError(originalError, {
      status: 404,
    });

    expect(error.code).toBe("NOT_FOUND");
  });

  it("normaliza un error 422 como VALIDATION_ERROR", () => {
    const originalError = new Error("Validation failed");

    const details = {
      email: ["Correo inválido"],
    };

    const error = normalizeApiError(originalError, {
      status: 422,
      details,
    });

    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual(details);
  });

  it("normaliza un error 400 con errores por campo como VALIDATION_ERROR", () => {
    const originalError = new Error("Request failed with status code 400");

    const details = {
      username: ["A user with that username already exists."],
      email: ["user with this email already exists."],
    };

    const error = normalizeApiError(originalError, {
      status: 400,
      details,
    });

    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual(details);
  });

  it("acepta mensajes de validación representados como strings", () => {
    const originalError = new Error("Bad request");

    const details = {
      username: "El usuario ya existe.",
    };

    const error = normalizeApiError(originalError, {
      status: 400,
      details,
    });

    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual(details);
  });

  it("no clasifica un 400 con detalles no estructurados como VALIDATION_ERROR", () => {
    const originalError = new Error("Bad request");

    const error = normalizeApiError(originalError, {
      status: 400,
      details: {
        message: {
          reason: "La solicitud no puede procesarse.",
        },
      },
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
  });

  it("no clasifica un 400 sin detalles como VALIDATION_ERROR", () => {
    const originalError = new Error("Bad request");

    const error = normalizeApiError(originalError, {
      status: 400,
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
  });

  it("no clasifica detalles vacíos como VALIDATION_ERROR", () => {
    const originalError = new Error("Bad request");

    const error = normalizeApiError(originalError, {
      status: 400,
      details: {},
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
  });

  it("no clasifica detalles con valores no textuales como VALIDATION_ERROR", () => {
    const originalError = new Error("Bad request");

    const error = normalizeApiError(originalError, {
      status: 400,
      details: {
        username: 123,
      },
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
  });

  it("no clasifica un array como errores por campo", () => {
    const originalError = new Error("Bad request");

    const error = normalizeApiError(originalError, {
      status: 400,
      details: ["Error 1", "Error 2"],
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
  });

  it("normaliza errores 500 como SERVER_ERROR", () => {
    const originalError = new Error("Internal server error");

    const error = normalizeApiError(originalError, {
      status: 500,
    });

    expect(error.code).toBe("SERVER_ERROR");
  });

  it("normaliza cualquier estado 5xx como SERVER_ERROR", () => {
    const originalError = new Error("Service unavailable");

    const error = normalizeApiError(originalError, {
      status: 503,
    });

    expect(error.code).toBe("SERVER_ERROR");
  });

  it("normaliza un Error sin estado HTTP como NETWORK_ERROR", () => {
    const originalError = new Error("Network failure");

    const error = normalizeApiError(originalError);

    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.cause).toBe(originalError);
  });

  it("normaliza un error desconocido como UNKNOWN_ERROR", () => {
    const error = normalizeApiError("unexpected failure", {
      status: 418,
    });

    expect(error.code).toBe("UNKNOWN_ERROR");
    expect(error.message).toBe("Ocurrió un error inesperado.");
  });

  it("utiliza el mensaje proporcionado por el contexto", () => {
    const originalError = new Error("Original message");

    const error = normalizeApiError(originalError, {
      status: 500,
      message: "Mensaje personalizado",
    });

    expect(error.message).toBe("Mensaje personalizado");
  });

  it("ignora un mensaje vacío proporcionado por el contexto", () => {
    const originalError = new Error("Original message");

    const error = normalizeApiError(originalError, {
      status: 500,
      message: "   ",
    });

    expect(error.message).toBe("Original message");
  });

  it("utiliza el mensaje por defecto cuando el error no tiene mensaje", () => {
    const originalError = {};

    const error = normalizeApiError(originalError);

    expect(error.code).toBe("UNKNOWN_ERROR");
    expect(error.message).toBe("Ocurrió un error inesperado.");
  });

  it("conserva los detalles proporcionados por la capa API", () => {
    const originalError = new Error("Bad request");

    const details = {
      username: ["El usuario ya existe."],
      email: ["El correo ya existe."],
    };

    const error = normalizeApiError(originalError, {
      status: 400,
      details,
    });

    expect(error.details).toEqual(details);
  });

  it("devuelve el mismo AppError cuando ya está normalizado", () => {
    const originalError = new AppError(
      "VALIDATION_ERROR",
      "Los datos no son válidos",
      {
        details: {
          email: ["Correo inválido"],
        },
      },
    );

    const error = normalizeApiError(originalError, {
      status: 400,
      details: {
        other: ["Otro error"],
      },
    });

    expect(error).toBe(originalError);
  });
});
