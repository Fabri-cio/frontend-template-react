import type { ReactNode } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

import { cn } from "../../../lib/cn";

export interface KanbanBoardProps {
  /** Columnas que se mostrarán dentro del tablero. */
  children: ReactNode;

  /** Se ejecuta cuando termina una operación de drag & drop. */
  onDragEnd: (result: DropResult) => void;

  /** Clases adicionales para el contenedor del tablero. */
  className?: string;
}

/**
 * Contenedor genérico para tableros Kanban.
 *
 * No conoce el dominio de la aplicación.
 * La lógica de negocio debe resolverse en el componente
 * que utilice el Kanban.
 *
 * Las columnas se muestran horizontalmente y permiten
 * desplazamiento horizontal en pantallas pequeñas.
 */
export function KanbanBoard({
  children,
  onDragEnd,
  className,
}: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cn("flex min-w-0 gap-3 overflow-x-auto pb-4", className)}>
        {children}
      </div>
    </DragDropContext>
  );
}
