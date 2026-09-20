import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, expect, it } from "vitest";

import { ToastProvider } from "./ToastProvider";
import { useToast } from "./useToast";

function TestComponent() {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        showToast({
          variant: "success",
          title: "Éxito",
          children: "Operación completada.",
        })
      }
    >
      Mostrar toast
    </button>
  );
}

describe("ToastProvider", () => {
  it("muestra un toast cuando se llama showToast", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mostrar toast",
      }),
    );

    expect(screen.getByText("Éxito")).toBeInTheDocument();
    expect(screen.getByText("Operación completada.")).toBeInTheDocument();
  });

  it("permite cerrar un toast", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mostrar toast",
      }),
    );

    expect(screen.getByText("Operación completada.")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cerrar/i,
      }),
    );

    expect(screen.queryByText("Operación completada.")).not.toBeInTheDocument();
  });

  it("puede mostrar varios toasts", async () => {
    const user = userEvent.setup();

    function MultipleToastComponent() {
      const { showToast } = useToast();

      return (
        <button
          type="button"
          onClick={() => {
            showToast({
              variant: "success",
              title: "Éxito 1",
              children: "Primera operación.",
            });

            showToast({
              variant: "info",
              title: "Información",
              children: "Segunda operación.",
            });
          }}
        >
          Mostrar toasts
        </button>
      );
    }

    render(
      <ToastProvider>
        <MultipleToastComponent />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mostrar toasts",
      }),
    );

    expect(screen.getByText("Primera operación.")).toBeInTheDocument();

    expect(screen.getByText("Segunda operación.")).toBeInTheDocument();
  });

  it("cierra automáticamente el toast después de la duración por defecto", () => {
    vi.useFakeTimers();

    try {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>,
      );

      act(() => {
        screen
          .getByRole("button", {
            name: "Mostrar toast",
          })
          .click();
      });

      expect(screen.getByText("Operación completada.")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3999);
      });

      expect(screen.getByText("Operación completada.")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(
        screen.queryByText("Operación completada."),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("permite configurar una duración personalizada", () => {
    vi.useFakeTimers();

    try {
      function CustomDurationComponent() {
        const { showToast } = useToast();

        return (
          <button
            type="button"
            onClick={() =>
              showToast({
                variant: "success",
                title: "Éxito",
                children: "Toast personalizado.",
                duration: 8000,
              })
            }
          >
            Mostrar toast personalizado
          </button>
        );
      }

      render(
        <ToastProvider>
          <CustomDurationComponent />
        </ToastProvider>,
      );

      act(() => {
        screen
          .getByRole("button", {
            name: "Mostrar toast personalizado",
          })
          .click();
      });

      act(() => {
        vi.advanceTimersByTime(7999);
      });

      expect(screen.getByText("Toast personalizado.")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(
        screen.queryByText("Toast personalizado."),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("no cierra automáticamente un toast con duration 0", () => {
    vi.useFakeTimers();

    try {
      function PersistentToastComponent() {
        const { showToast } = useToast();

        return (
          <button
            type="button"
            onClick={() =>
              showToast({
                variant: "info",
                title: "Información",
                children: "Toast permanente.",
                duration: 0,
              })
            }
          >
            Mostrar toast permanente
          </button>
        );
      }

      render(
        <ToastProvider>
          <PersistentToastComponent />
        </ToastProvider>,
      );

      act(() => {
        screen
          .getByRole("button", {
            name: "Mostrar toast permanente",
          })
          .click();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByText("Toast permanente.")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("usa top-right como posición por defecto", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const container = screen.getByLabelText("Notificaciones");

    expect(container).toHaveClass("right-4");
    expect(container).toHaveClass("top-4");
    expect(container).toHaveClass("items-end");
  });

  it("permite configurar la posición", () => {
    render(
      <ToastProvider position="bottom-center">
        <TestComponent />
      </ToastProvider>,
    );

    const container = screen.getByLabelText("Notificaciones");

    expect(container).toHaveClass("bottom-4");
    expect(container).toHaveClass("left-1/2");
    expect(container).toHaveClass("-translate-x-1/2");
    expect(container).toHaveClass("items-center");
  });
});
