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

interface ToastItem {
  id: string;
  options: ToastOptions;
}

interface ToastProviderProps {
  children: ReactNode;
}

const DEFAULT_TOAST_DURATION = 4000;

function createToastId(): string {
  return crypto.randomUUID();
}

export function ToastProvider({ children }: ToastProviderProps) {
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
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:left-auto sm:w-full sm:max-w-sm"
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
