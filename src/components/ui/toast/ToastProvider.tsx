import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Toast } from "./Toast";
import { ToastContext, type ToastOptions } from "./ToastContext";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

interface ToastItem {
  id: string;
  options: ToastOptions;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

const DEFAULT_TOAST_DURATION = 4000;

function createToastId(): string {
  return crypto.randomUUID();
}

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "right-4 top-4 items-end",
  "top-left": "left-4 top-4 items-start",
  "top-center": "left-1/2 top-4 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

export function ToastProvider({
  children,
  position = "top-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = createToastId();
      const duration = options.duration ?? DEFAULT_TOAST_DURATION;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          options,
        },
      ]);

      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismissToast(id);
        }, duration);

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers.clear();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        aria-label="Notificaciones"
        className={[
          "pointer-events-none fixed z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3",
          positionClasses[position],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {toasts.map(({ id, options }) => {
          const { duration: _duration, ...toastProps } = options;

          return (
            <div key={id} className="pointer-events-auto w-full">
              <Toast {...toastProps} onClose={() => dismissToast(id)} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
