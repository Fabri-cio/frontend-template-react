import { useMemo, useState } from "react";

import Checkbox from "../Checkbox";
import Spinner from "../Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableAlign,
} from "./Table";

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  id: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: TableAlign;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string | number;

  caption?: string;

  loading?: boolean;
  emptyMessage?: string;

  selectable?: boolean;
  selectedRows?: Array<string | number>;
  onSelectedRowsChange?: (selectedRows: Array<string | number>) => void;

  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;

  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;

  className?: string;
}

function getNextSort(
  currentSort: DataTableSort | null | undefined,
  columnId: string,
): DataTableSort | null {
  if (!currentSort || currentSort.id !== columnId) {
    return {
      id: columnId,
      direction: "asc",
    };
  }

  if (currentSort.direction === "asc") {
    return {
      id: columnId,
      direction: "desc",
    };
  }

  return null;
}

/**
 * Tabla genérica reutilizable para cualquier feature.
 *
 * No contiene lógica de negocio ni depende de una API concreta.
 * La ordenación y selección pueden ser controladas desde el componente padre.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  loading = false,
  emptyMessage = "No hay datos para mostrar.",
  selectable = false,
  selectedRows,
  onSelectedRowsChange,
  sort = null,
  onSortChange,
  striped = false,
  hoverable = true,
  stickyHeader = false,
  className = "",
}: DataTableProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    Array<string | number>
  >([]);

  const isControlled = selectedRows !== undefined;

  const currentSelectedRows = isControlled
    ? selectedRows
    : internalSelectedRows;

  const rowIds = useMemo(
    () => data.map((row) => getRowId(row)),
    [data, getRowId],
  );

  const allSelected =
    selectable &&
    rowIds.length > 0 &&
    rowIds.every((id) => currentSelectedRows.includes(id));

  const someSelected =
    selectable &&
    rowIds.some((id) => currentSelectedRows.includes(id)) &&
    !allSelected;

  function updateSelectedRows(nextSelectedRows: Array<string | number>) {
    if (!isControlled) {
      setInternalSelectedRows(nextSelectedRows);
    }

    onSelectedRowsChange?.(nextSelectedRows);
  }

  function handleSelectAll() {
    if (allSelected) {
      updateSelectedRows(
        currentSelectedRows.filter((id) => !rowIds.includes(id)),
      );
      return;
    }

    const nextSelectedRows = Array.from(
      new Set([...currentSelectedRows, ...rowIds]),
    );

    updateSelectedRows(nextSelectedRows);
  }

  function handleSelectRow(rowId: string | number) {
    if (currentSelectedRows.includes(rowId)) {
      updateSelectedRows(currentSelectedRows.filter((id) => id !== rowId));
      return;
    }

    updateSelectedRows([...currentSelectedRows, rowId]);
  }

  function handleSort(column: DataTableColumn<T>) {
    if (!column.sortable || !onSortChange) {
      return;
    }

    onSortChange(getNextSort(sort, column.id));
  }

  function renderCell(column: DataTableColumn<T>, row: T): React.ReactNode {
    if (column.cell) {
      return column.cell(row);
    }

    if (!column.accessor) {
      return null;
    }

    const value = row[column.accessor];

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      return value;
    }

    return null;
  }

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <Table
        striped={striped}
        hoverable={hoverable}
        stickyHeader={stickyHeader}
      >
        {caption ? (
          <caption className="mb-3 text-left text-sm text-muted-foreground">
            {caption}
          </caption>
        ) : null}

        <TableHeader>
          <TableRow striped={striped} hoverable={false}>
            {selectable ? (
              <TableHead align="center" size="compact">
                <Checkbox
                  aria-label="Seleccionar todas las filas"
                  checked={allSelected}
                  data-indeterminate={someSelected || undefined}
                  onChange={handleSelectAll}
                />
              </TableHead>
            ) : null}

            {columns.map((column) => {
              const isSorted = sort?.id === column.id;

              return (
                <TableHead
                  key={column.id}
                  align={column.align}
                  sticky={stickyHeader}
                  style={{ width: column.width }}
                  aria-sort={
                    isSorted
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : column.sortable
                        ? "none"
                        : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-semibold hover:underline"
                      onClick={() => handleSort(column)}
                    >
                      <span>{column.header}</span>

                      <span
                        aria-hidden="true"
                        className="text-xs text-muted-foreground"
                      >
                        {isSorted
                          ? sort.direction === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow hoverable={false}>
              <TableCell colSpan={colSpan} align="center">
                <div className="flex justify-center py-4">
                  <Spinner size="md" />
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow hoverable={false}>
              <TableCell
                colSpan={colSpan}
                align="center"
                className="py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const rowId = getRowId(row);
              const isSelected = currentSelectedRows.includes(rowId);

              return (
                <TableRow
                  key={rowId}
                  selected={isSelected}
                  striped={striped}
                  hoverable={hoverable}
                >
                  {selectable ? (
                    <TableCell align="center" size="compact">
                      <Checkbox
                        aria-label={`Seleccionar fila ${rowId}`}
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                      />
                    </TableCell>
                  ) : null}

                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width }}
                    >
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
