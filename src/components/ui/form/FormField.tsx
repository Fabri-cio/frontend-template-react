import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Campo genérico para formularios.
 *
 * Se encarga únicamente de la presentación del label,
 * descripción y mensaje de error.
 *
 * No contiene lógica de validación ni depende de una API.
 */
export function FormField({
  label,
  htmlFor,
  error,
  description,
  required = false,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={["space-y-2", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}

        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </label>

      {children}

      {description && !error ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}

      {error ? (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
