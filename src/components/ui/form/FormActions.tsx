import type { ReactNode } from "react";

export interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor genérico para las acciones de un formulario.
 *
 * No contiene lógica de negocio ni depende de ninguna feature.
 * Permite mantener una estructura consistente para los botones
 * de guardar, cancelar u otras acciones.
 */
export function FormActions({ children, className = "" }: FormActionsProps) {
  return (
    <div
      className={[
        "flex flex-col-reverse gap-3",
        "sm:flex-row sm:items-center sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default FormActions;
