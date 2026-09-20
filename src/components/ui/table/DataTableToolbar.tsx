import { useEffect, useState, type ReactNode } from "react";
import { Filter, Search } from "lucide-react";

import Input from "../Input";

export interface DataTableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  showFilters?: boolean;
  onShowFiltersChange?: (showFilters: boolean) => void;

  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Barra reutilizable para DataTable.
 *
 * Permite mostrar búsqueda, filtros y acciones.
 * No contiene lógica específica de ninguna feature.
 */
export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  showFilters = false,
  onShowFiltersChange,
  actions,
  children,
  className = "",
}: DataTableToolbarProps) {
  const hasSearch = search !== undefined && onSearchChange !== undefined;
  const hasFilterToggle = onShowFiltersChange !== undefined;

  const [searchOpen, setSearchOpen] = useState(Boolean(search));

  useEffect(() => {
    if (search) {
      setSearchOpen(true);
    }
  }, [search]);

  function handleSearchToggle() {
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }

    if (!search?.trim()) {
      setSearchOpen(false);
    }
  }

  function handleFiltersToggle() {
    onShowFiltersChange?.(!showFilters);
  }

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
        <div className="flex items-center gap-2">
          {hasSearch ? (
            <>
              {!searchOpen ? (
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  aria-label="Mostrar búsqueda"
                  title="Buscar"
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center",
                    "rounded-md border border-border bg-background",
                    "text-muted-foreground",
                    "transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-primary/20",
                  ].join(" ")}
                >
                  <Search size={18} aria-hidden="true" />
                </button>
              ) : (
                <div className="relative w-full sm:max-w-sm">
                  <Search
                    size={18}
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute left-3 top-1/2",
                      "-translate-y-1/2 text-muted-foreground",
                    ].join(" ")}
                  />

                  <Input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label="Buscar"
                    autoFocus
                    className="pl-10"
                  />
                </div>
              )}
            </>
          ) : null}

          {hasFilterToggle ? (
            <button
              type="button"
              onClick={handleFiltersToggle}
              aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              aria-pressed={showFilters}
              title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              className={[
                "inline-flex h-10 w-10 items-center justify-center",
                "rounded-md border border-border bg-background",
                "text-muted-foreground",
                "transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/20",
                showFilters ? "bg-muted text-foreground" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Filter size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {children}
      </div>

      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export default DataTableToolbar;
