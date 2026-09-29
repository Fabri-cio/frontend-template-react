import type { HTMLAttributes, ReactNode } from "react";
import { Inbox } from "lucide-react";

/**
 * ============================================================================
 * EmptyState
 * ============================================================================
 *
 * Estado visual genérico para representar ausencia de información.
 *
 * No conoce ningún dominio concreto.
 *
 * Ejemplos:
 *
 * <EmptyState title="No hay usuarios" />
 *
 * <EmptyState
 *   title="No hay resultados"
 *   description="No se encontraron registros."
 * />
 *
 * <EmptyState
 *   title="Sin productos"
 *   action={<Button>Crear producto</Button>}
 * />
 */

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** Título principal del estado vacío. */
  title: ReactNode;

  /** Descripción opcional. */
  description?: ReactNode;

  /** Icono mostrado en el estado vacío. */
  icon?: ReactNode;

  /** Acción opcional, normalmente un botón. */
  action?: ReactNode;
}

function EmptyState({
  title,
  description,
  icon = <Inbox className="size-6" aria-hidden="true" />,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  const classes = [
    "flex min-h-40 w-full flex-col items-center justify-center",
    "gap-3 px-4 py-8 text-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <div
        className={[
          "flex size-12 items-center justify-center rounded-full",
          "bg-muted text-muted-foreground",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        {description && (
          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
