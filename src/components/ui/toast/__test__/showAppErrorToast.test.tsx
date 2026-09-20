import { describe, expect, it, vi } from "vitest";

import { AppError } from "../../../../app/errors/app-error";
import type { ToastContextValue } from "../ToastContext";
import { showAppErrorToast } from "../showAppErrorToast";

function createToastMock(): ToastContextValue {
  return {
    showToast: vi.fn(),
    dismissToast: vi.fn(),
  };
}

describe("showAppErrorToast", () => {
  it("muestra un toast para un error general", () => {
    const toast = createToastMock();

    const error = new AppError("SERVER_ERROR", "Error original del servidor");

    showAppErrorToast(toast, error);

    expect(toast.showToast).toHaveBeenCalledTimes(1);
    expect(toast.showToast).toHaveBeenCalledWith({
      variant: "error",
      title: "Error del servidor",
      children: "Ocurrió un error en el servidor.",
    });
  });

  it("no muestra un toast para un error de validación", () => {
    const toast = createToastMock();

    const error = new AppError("VALIDATION_ERROR", "Error de validación", {
      details: {
        username: ["Este usuario ya existe."],
      },
    });

    showAppErrorToast(toast, error);

    expect(toast.showToast).not.toHaveBeenCalled();
  });

  it("presenta correctamente un error de conexión", () => {
    const toast = createToastMock();

    const error = new AppError("NETWORK_ERROR", "Error original de conexión");

    showAppErrorToast(toast, error);

    expect(toast.showToast).toHaveBeenCalledWith({
      variant: "error",
      title: "Error de conexión",
      children: "No se pudo conectar con el servidor.",
    });
  });
});
