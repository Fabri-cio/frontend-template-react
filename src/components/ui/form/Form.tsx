import type { FormHTMLAttributes, ReactNode } from "react";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor genérico para formularios.
 *
 * No contiene lógica de negocio, validación ni conexión
 * con ninguna API. Solo proporciona una estructura visual
 * reutilizable para cualquier feature.
 */
export function Form({ children, className = "", ...props }: FormProps) {
  return (
    <form
      {...props}
      className={["space-y-6", className].filter(Boolean).join(" ")}
    >
      {children}
    </form>
  );
}

export default Form;
