import type { ChangeEvent, SelectHTMLAttributes } from "react";

import Select from "../Select";

export interface DataTableToolbarFilterOption {
  value: string;
  label: string;
}

export interface DataTableToolbarFilterProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "children"
> {
  value: string;
  onChange: (value: string) => void;
  options: DataTableToolbarFilterOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Filtro reutilizable para DataTable.
 *
 * Utiliza el componente Select existente y no contiene
 * lógica específica de ninguna feature.
 */
export function DataTableToolbarFilter({
  value,
  onChange,
  options,
  label,
  placeholder,
  className = "",
  ...props
}: DataTableToolbarFilterProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <div
      className={["flex items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}

      <Select
        {...props}
        value={value}
        onChange={handleChange}
        aria-label={props["aria-label"] ?? label}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default DataTableToolbarFilter;
