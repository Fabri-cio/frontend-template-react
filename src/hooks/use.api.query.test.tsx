import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { AppError } from "../app/errors/app-error";
import { useApiQuery } from "./use.api.query";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function createWrapper() {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useApiQuery", () => {
  it("ejecuta la consulta y devuelve los datos", async () => {
    const queryFn = async () => {
      return {
        id: 1,
        name: "Usuario de prueba",
      };
    };

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["users", "detail", 1],
          queryFn,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: 1,
      name: "Usuario de prueba",
    });
  });

  it("expone el estado de carga", () => {
    const queryFn = () =>
      new Promise<{ id: number }>(() => {
        // La promesa queda pendiente para mantener la consulta en loading.
      });

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["users", "list"],
          queryFn,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.isPending).toBe(true);
  });

  it("expone los errores de la consulta como AppError", async () => {
    const error = new AppError(
      "NETWORK_ERROR",
      "No se pudo conectar con el servidor",
    );

    const queryFn = async () => {
      throw error;
    };

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["users", "detail", 1],
          queryFn,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.error?.code).toBe("NETWORK_ERROR");
  });

  it("respeta enabled cuando la consulta está deshabilitada", () => {
    let queryExecuted = false;

    const queryFn = async () => {
      queryExecuted = true;
      return "datos";
    };

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: ["users", "detail", 0],
          queryFn,
          enabled: false,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.isPending).toBe(true);
    expect(queryExecuted).toBe(false);
  });
});
