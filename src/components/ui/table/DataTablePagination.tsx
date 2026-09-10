import Pagination from "../Pagination";

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  siblingCount?: number;
  className?: string;
}

/**
 * Paginación reutilizable para DataTable.
 *
 * Utiliza el componente Pagination existente para mantener
 * una única implementación de la navegación entre páginas.
 */
export function DataTablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  siblingCount = 1,
  className = "",
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextPageSize = Number(event.target.value);

    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
      return;
    }

    onPageSizeChange?.(nextPageSize);
  }

  return (
    <div
      className={[
        "flex flex-col gap-4 border-t border-border py-4",
        "sm:flex-row sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-sm text-muted-foreground">
        {totalItems === 0
          ? "No hay registros."
          : `Mostrando ${Math.min(
              (page - 1) * pageSize + 1,
              totalItems,
            )} a ${Math.min(
              page * pageSize,
              totalItems,
            )} de ${totalItems} registros.`}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {showPageSize && onPageSizeChange ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filas por página</span>

            <select
              aria-label="Filas por página"
              value={pageSize}
              onChange={handlePageSizeChange}
              className={[
                "h-9 rounded-md border border-border",
                "bg-background px-3 text-sm text-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/20",
              ].join(" ")}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          siblingCount={siblingCount}
          showFirstLast
        />
      </div>
    </div>
  );
}

export default DataTablePagination;
