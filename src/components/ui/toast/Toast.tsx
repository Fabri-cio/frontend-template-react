import type { HTMLAttributes, ReactNode } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  variant?: ToastVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

const variantClasses: Record<ToastVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100",
};

const variantIcons: Record<ToastVariant, string> = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

export function Toast({
  variant = "info",
  title,
  children,
  onClose,
  closeLabel = "Cerrar",
  className = "",
  ...props
}: ToastProps) {
  const classes = [
    "relative flex w-full gap-3 rounded-lg border p-4 shadow-md",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      role="status"
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={classes}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
      >
        {variantIcons[variant]}
      </span>

      <div className="min-w-0 flex-1">
        {title ? <p className="font-medium">{title}</p> : null}

        <div className={title ? "mt-1 text-sm" : "text-sm"}>{children}</div>
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="shrink-0 rounded-md p-1 text-current/70 transition-colors hover:bg-black/5 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}

export default Toast;
