import type { ReactNode } from "react";
import { Droppable } from "@hello-pangea/dnd";

import { cn } from "../../../lib/cn";

export interface KanbanColumnProps {
  /** Identificador único de la columna dentro del tablero. */
  id: string;

  /** Título visible de la columna. */
  title: ReactNode;

  /** Cantidad de elementos mostrados en la columna. */
  count?: number;

  /** Tarjetas que pertenecen a la columna. */
  children: ReactNode;

  /** Contenido mostrado cuando la columna no tiene tarjetas. */
  emptyMessage?: ReactNode;

  /** Clases adicionales para la columna. */
  className?: string;
}

/**
 * Columna genérica de un tablero Kanban.
 *
 * No conoce ningún dominio concreto. Puede utilizarse para
 * producción, tareas, pedidos, incidencias, etc.
 */
export function KanbanColumn({
  id,
  title,
  count,
  children,
  emptyMessage = "Sin elementos",
  className,
}: KanbanColumnProps) {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn("flex w-72 shrink-0 flex-col", className)}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {title}
              </h2>
            </div>

            {count !== undefined && (
              <span className="ml-2 shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {count}
              </span>
            )}
          </div>

          <div
            className={cn(
              "min-h-24 flex-1 space-y-2 rounded-lg bg-muted/50 p-1.5",
              "transition-colors",
              snapshot.isDraggingOver && "bg-accent",
            )}
          >
            {children}

            {provided.placeholder}

            {count === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                {emptyMessage}
              </p>
            )}
          </div>
        </section>
      )}
    </Droppable>
  );
}
