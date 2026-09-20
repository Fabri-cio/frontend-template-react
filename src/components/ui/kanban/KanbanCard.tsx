import type { ReactNode } from "react";
import { Draggable } from "@hello-pangea/dnd";

import { cn } from "../../../lib/cn";

export interface KanbanCardProps {
  /** Identificador único de la tarjeta dentro del tablero. */
  id: string;

  /** Contenido que se mostrará dentro de la tarjeta. */
  children: ReactNode;

  /** Posición de la tarjeta dentro de su columna. */
  index: number;

  /** Permite desactivar temporalmente el drag de la tarjeta. */
  isDragDisabled?: boolean;

  /** Clases adicionales para la tarjeta. */
  className?: string;
}

/**
 * Tarjeta genérica y arrastrable para un tablero Kanban.
 *
 * El componente no conoce el contenido de la tarjeta.
 * Cada feature puede proporcionar su propio contenido
 * mediante `children`.
 */
export function KanbanCard({
  id,
  children,
  index,
  isDragDisabled = false,
  className,
}: KanbanCardProps) {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "rounded-lg border border-border bg-card p-3",
            "shadow-sm transition-shadow",
            "cursor-grab active:cursor-grabbing",
            "hover:shadow-md",
            snapshot.isDragging && "shadow-lg",
            isDragDisabled && "cursor-default opacity-70",
            className,
          )}
        >
          {children}
        </article>
      )}
    </Draggable>
  );
}
