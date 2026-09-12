import type { AppError } from "../../../app/errors/app-error";
import { getErrorPresentation } from "../../../app/errors/error-presenter";

import type { ToastContextValue } from "./ToastContext";

export function showAppErrorToast(
  toast: ToastContextValue,
  error: AppError,
): void {
  const presentation = getErrorPresentation(error);

  if (!presentation) {
    return;
  }

  toast.showToast({
    variant: "error",
    title: presentation.title,
    children: presentation.message,
  });
}
