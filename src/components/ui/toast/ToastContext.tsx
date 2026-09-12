import { createContext } from "react";

import type { ToastProps } from "./Toast";

export type ToastOptions = Omit<ToastProps, "onClose"> & {
  /**
   * Duración en milisegundos.
   * 0 desactiva el cierre automático.
   */
  duration?: number;
};

export interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
