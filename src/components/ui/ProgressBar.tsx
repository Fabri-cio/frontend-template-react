import { cn } from "../../lib/cn";

export type ProgressBarVariant =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "muted";

export interface ProgressBarProps {
  /** Valor actual del progreso. */
  value: number;

  /** Valor máximo utilizado para calcular el porcentaje. */
  max?: number;

  /** Clases adicionales para el contenedor. */
  className?: string;

  /** Variante visual de la barra. */
  variant?: ProgressBarVariant;

  /** Muestra el porcentaje al lado derecho. */
  showLabel?: boolean;

  /** Texto opcional mostrado al lado izquierdo. */
  label?: string;
}

const variantClasses: Record<ProgressBarVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

/**
 * Barra de progreso reutilizable.
 *
 * No depende de un feature específico.
 * Puede utilizarse en producción, reportes, dashboards,
 * tareas, cargas y otros módulos de la aplicación.
 */
export function ProgressBar({
  value,
  max = 100,
  className,
  variant = "primary",
  showLabel = false,
  label,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / safeMax) * 100)),
  );

  const hasHeader = showLabel || Boolean(label);

  return (
    <div className={cn("w-full", className)}>
      {hasHeader && (
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>

          {showLabel && <span>{percentage}%</span>}
        </div>
      )}

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso"}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            variantClasses[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}