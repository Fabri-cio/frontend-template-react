import type { ReactNode } from "react";

import Input from "../Input";

export interface DataTableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Barra reutilizable para DataTable.
 *
 * Permite mostrar búsqueda, filtros u otras acciones.
 * No contiene lógica específica de ninguna feature.
 */
export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  actions,
  children,
  className = "",
}: DataTableToolbarProps) {
  const hasSearch = search !== undefined && onSearchChange !== undefined;

  return (
    <div
      className={[
        "flex flex-col gap-3 py-4",
        "sm:flex-row sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {hasSearch ? (
          <div className="w-full sm:max-w-sm">
            <Input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Buscar"
            />
          </div>
        ) : null}

        {children}
      </div>

      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export default DataTableToolbar;
