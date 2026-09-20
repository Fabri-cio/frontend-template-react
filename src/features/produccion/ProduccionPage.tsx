import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { Clock, Factory, User } from "lucide-react";

import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "../../components/ui/kanban";

import { Avatar, Badge, PageHeader, ProgressBar } from "../../components/ui";

// ============================================================================
// CONEXIÓN REAL — TEMPORALMENTE COMENTADA
// ============================================================================
//
// Cuando dejemos de usar el mock:
//
// import { useProduccionOperaciones } from "./produccion.hooks";
//
// Y dentro de ProduccionPage:
//
// const {
//   data: operations = [],
//   isLoading,
// } = useProduccionOperaciones();
//
// Luego:
//
// ProduccionPage
//      ↓
// useProduccionOperaciones()
//      ↓
// produccionApi.list()
//      ↓
// createCrudOperations()
//      ↓
// api.get()
//      ↓
// Django REST Framework
//
// ============================================================================

import type { ProduccionOperacionEstado } from "./produccion.types";

/**
 * ============================================================================
 * COLUMNAS
 * ============================================================================
 *
 * Estas columnas corresponden a los estados reales de
 * ProduccionOperacion en el backend.
 */
const PRODUCCION_COLUMNAS: Array<{
  id: ProduccionOperacionEstado;
  title: string;
  badgeVariant: "primary" | "success" | "warning" | "info" | "destructive";
  dotClass: string;
}> = [
  {
    id: "pendiente",
    title: "Pendiente",
    badgeVariant: "info",
    dotClass: "bg-info",
  },
  {
    id: "en_proceso",
    title: "En proceso",
    badgeVariant: "primary",
    dotClass: "bg-primary",
  },
  {
    id: "completada",
    title: "Completada",
    badgeVariant: "success",
    dotClass: "bg-success",
  },
  {
    id: "cancelada",
    title: "Cancelada",
    badgeVariant: "destructive",
    dotClass: "bg-destructive",
  },
];

/**
 * ============================================================================
 * MOCK
 * ============================================================================
 *
 * Los campos siguientes son exclusivamente para la demostración visual.
 *
 * En el backend actual NO forman parte directamente de
 * ProduccionOperacion:
 *
 * - pedidoNumero
 * - maquinaNombre
 * - operador
 * - prioridad
 * - cantidad_planificada
 * - tiempoTranscurrido
 * - tiempoEstimado
 *
 * Estos campos desaparecerán cuando conectemos la información real.
 */
type ProduccionOperacionMock = {
  id: number;

  orden_ruta: number;
  ruta_operacion: number;
  resultado_viabilidad: number;
  equipo: number;

  numero_operacion: number;

  fecha_inicio_planificada: string;
  fecha_inicio_real: string | null;

  fecha_fin_planificada: string;
  fecha_fin_real: string | null;

  estado: ProduccionOperacionEstado;

  cantidad_producida: string;

  observaciones: string;

  created_at: string;
  updated_at: string;

  // --------------------------------------------------------------------------
  // Datos visuales temporales
  // --------------------------------------------------------------------------

  pedidoNumero: string;
  maquinaNombre: string;
  operador: string;

  prioridad: "baja" | "normal" | "alta" | "urgente";

  cantidad_planificada: number;

  tiempoTranscurrido: string;
  tiempoEstimado: string;

  /**
   * Posición utilizada únicamente para la prueba local del Kanban.
   */
  order: number;
};

const MOCK_OPERACIONES: ProduccionOperacionMock[] = [
  {
    id: 1,
    orden_ruta: 101,
    ruta_operacion: 1,
    resultado_viabilidad: 201,
    equipo: 1,
    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T08:00:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-20T12:00:00",
    fecha_fin_real: null,

    estado: "pendiente",

    cantidad_producida: "125",

    observaciones: "",

    created_at: "2026-09-19T10:00:00",
    updated_at: "2026-09-19T10:00:00",

    pedidoNumero: "OP-1001",
    maquinaNombre: "Extrusora A",
    operador: "Juan Pérez",
    prioridad: "alta",
    cantidad_planificada: 500,
    tiempoTranscurrido: "1h",
    tiempoEstimado: "4h",
    order: 0,
  },

  {
    id: 2,
    orden_ruta: 102,
    ruta_operacion: 1,
    resultado_viabilidad: 202,
    equipo: 2,
    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T07:30:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-20T11:30:00",
    fecha_fin_real: null,

    estado: "pendiente",

    cantidad_producida: "240",

    observaciones: "",

    created_at: "2026-09-19T10:10:00",
    updated_at: "2026-09-19T10:10:00",

    pedidoNumero: "OP-1002",
    maquinaNombre: "Extrusora B",
    operador: "María López",
    prioridad: "normal",
    cantidad_planificada: 600,
    tiempoTranscurrido: "1h 30m",
    tiempoEstimado: "4h",
    order: 1,
  },

  {
    id: 3,
    orden_ruta: 103,
    ruta_operacion: 2,
    resultado_viabilidad: 203,
    equipo: 3,
    numero_operacion: 2,

    fecha_inicio_planificada: "2026-09-20T08:00:00",
    fecha_inicio_real: "2026-09-20T08:05:00",

    fecha_fin_planificada: "2026-09-20T14:00:00",
    fecha_fin_real: null,

    estado: "en_proceso",

    cantidad_producida: "325",

    observaciones: "",

    created_at: "2026-09-19T10:20:00",
    updated_at: "2026-09-20T10:00:00",

    pedidoNumero: "OP-1003",
    maquinaNombre: "Flexográfica A",
    operador: "Pedro Gómez",
    prioridad: "urgente",
    cantidad_planificada: 500,
    tiempoTranscurrido: "2h 15m",
    tiempoEstimado: "6h",
    order: 0,
  },

  {
    id: 4,
    orden_ruta: 104,
    ruta_operacion: 2,
    resultado_viabilidad: 204,
    equipo: 4,
    numero_operacion: 2,

    fecha_inicio_planificada: "2026-09-20T09:00:00",
    fecha_inicio_real: "2026-09-20T09:02:00",

    fecha_fin_planificada: "2026-09-20T15:00:00",
    fecha_fin_real: null,

    estado: "en_proceso",

    cantidad_producida: "280",

    observaciones: "",

    created_at: "2026-09-19T10:30:00",
    updated_at: "2026-09-20T10:15:00",

    pedidoNumero: "OP-1004",
    maquinaNombre: "Flexográfica B",
    operador: "Ana Torres",
    prioridad: "alta",
    cantidad_planificada: 400,
    tiempoTranscurrido: "2h",
    tiempoEstimado: "6h",
    order: 1,
  },

  {
    id: 5,
    orden_ruta: 105,
    ruta_operacion: 3,
    resultado_viabilidad: 205,
    equipo: 5,
    numero_operacion: 3,

    fecha_inicio_planificada: "2026-09-19T08:00:00",
    fecha_inicio_real: "2026-09-19T08:03:00",

    fecha_fin_planificada: "2026-09-19T14:00:00",
    fecha_fin_real: "2026-09-19T13:35:00",

    estado: "completada",

    cantidad_producida: "500",

    observaciones: "Producción completada correctamente.",

    created_at: "2026-09-18T10:00:00",
    updated_at: "2026-09-19T13:35:00",

    pedidoNumero: "OP-1005",
    maquinaNombre: "Confeccionadora A",
    operador: "Luis Pérez",
    prioridad: "normal",
    cantidad_planificada: 500,
    tiempoTranscurrido: "5h 35m",
    tiempoEstimado: "6h",
    order: 0,
  },

  {
    id: 6,
    orden_ruta: 106,
    ruta_operacion: 3,
    resultado_viabilidad: 206,
    equipo: 6,
    numero_operacion: 3,

    fecha_inicio_planificada: "2026-09-19T07:00:00",
    fecha_inicio_real: "2026-09-19T07:10:00",

    fecha_fin_planificada: "2026-09-19T13:00:00",
    fecha_fin_real: "2026-09-19T12:20:00",

    estado: "completada",

    cantidad_producida: "800",

    observaciones: "",

    created_at: "2026-09-18T10:10:00",
    updated_at: "2026-09-19T12:20:00",

    pedidoNumero: "OP-1006",
    maquinaNombre: "Confeccionadora B",
    operador: "Carlos Ruiz",
    prioridad: "alta",
    cantidad_planificada: 800,
    tiempoTranscurrido: "5h 10m",
    tiempoEstimado: "6h",
    order: 1,
  },

  {
    id: 7,
    orden_ruta: 107,
    ruta_operacion: 4,
    resultado_viabilidad: 207,
    equipo: 7,
    numero_operacion: 4,

    fecha_inicio_planificada: "2026-09-18T08:00:00",
    fecha_inicio_real: "2026-09-18T08:10:00",

    fecha_fin_planificada: "2026-09-18T10:00:00",
    fecha_fin_real: "2026-09-18T09:00:00",

    estado: "cancelada",

    cantidad_producida: "100",

    observaciones: "Orden cancelada por cambio de especificación.",

    created_at: "2026-09-17T09:00:00",
    updated_at: "2026-09-18T09:00:00",

    pedidoNumero: "OP-1007",
    maquinaNombre: "Equipo C",
    operador: "Sofía Mendoza",
    prioridad: "baja",
    cantidad_planificada: 300,
    tiempoTranscurrido: "1h",
    tiempoEstimado: "2h",
    order: 0,
  },
];

/**
 * ============================================================================
 * TRANSICIONES PERMITIDAS EN EL MOCK
 * ============================================================================
 *
 * Se basan en el flujo que actualmente implementa el backend:
 *
 * pendiente -> en_proceso
 * en_proceso -> completada
 *
 * Cancelada no tiene actualmente una acción específica en
 * ProduccionOperacionViewSet.
 */
const ALLOWED_TRANSITIONS: Record<
  ProduccionOperacionEstado,
  ProduccionOperacionEstado[]
> = {
  pendiente: ["en_proceso"],
  en_proceso: ["completada"],
  completada: [],
  cancelada: [],
};

/**
 * Comprueba si una transición está permitida.
 */
function isAllowedTransition(
  from: ProduccionOperacionEstado,
  to: ProduccionOperacionEstado,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Devuelve la configuración visual correspondiente a una prioridad.
 */
function getPriorityConfig(priority: ProduccionOperacionMock["prioridad"]) {
  const config = {
    baja: {
      label: "Baja",
      variant: "secondary" as const,
      dotClass: "bg-muted-foreground",
    },
    normal: {
      label: "Normal",
      variant: "info" as const,
      dotClass: "bg-info",
    },
    alta: {
      label: "Alta",
      variant: "warning" as const,
      dotClass: "bg-warning",
    },
    urgente: {
      label: "Urgente",
      variant: "destructive" as const,
      dotClass: "bg-destructive",
    },
  };

  return config[priority];
}

/**
 * Formatea fechas para la interfaz.
 */
function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

/**
 * Formatea cantidades.
 */
function formatQuantity(value: string | number): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Calcula el porcentaje producido.
 */
function calculateProgress(produced: string, planned: number): number {
  const producedValue = Number(produced);

  if (
    !Number.isFinite(producedValue) ||
    !Number.isFinite(planned) ||
    planned <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((producedValue / planned) * 100)),
  );
}

/**
 * ============================================================================
 * TARJETA DE PRODUCCIÓN
 * ============================================================================
 */
function ProduccionCardContent({
  operation,
}: {
  operation: ProduccionOperacionMock;
}) {
  const priority = getPriorityConfig(operation.prioridad);

  const progress = calculateProgress(
    operation.cantidad_producida,
    operation.cantidad_planificada,
  );

  return (
    <div className="space-y-3">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2.5 shrink-0 rounded-full ${priority.dotClass}`}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {operation.pedidoNumero}
            </p>

            <p className="text-xs text-muted-foreground">
              Operación #{operation.numero_operacion}
            </p>
          </div>
        </div>

        <Badge variant={priority.variant} className="shrink-0">
          {priority.label}
        </Badge>
      </div>

      {/* Máquina */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Factory className="size-3.5 shrink-0" />

        <span className="truncate">{operation.maquinaNombre}</span>
      </div>

      {/* Progreso */}
      <ProgressBar
        value={Number(operation.cantidad_producida)}
        max={operation.cantidad_planificada}
        variant={progress === 100 ? "success" : "primary"}
        showLabel
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatQuantity(operation.cantidad_producida)} /{" "}
          {formatQuantity(operation.cantidad_planificada)}
        </span>
      </div>

      {/* Tiempo */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3 shrink-0" />

        <span>
          {operation.tiempoTranscurrido} / {operation.tiempoEstimado}
        </span>
      </div>

      {/* Operador */}
      <div className="flex items-center gap-2 border-t border-border pt-2">
        <Avatar name={operation.operador} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <User className="size-3 shrink-0 text-muted-foreground" />

            <span className="truncate text-xs font-medium text-foreground">
              {operation.operador}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Equipo #{operation.equipo}
          </p>
        </div>
      </div>

      {/* Fechas */}
      <div className="space-y-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
        <p>
          Inicio:{" "}
          <span className="text-foreground">
            {formatDateTime(
              operation.fecha_inicio_real ?? operation.fecha_inicio_planificada,
            )}
          </span>
        </p>

        <p>
          Fin planificado:{" "}
          <span className="text-foreground">
            {formatDateTime(operation.fecha_fin_planificada)}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * REORDENAMIENTO LOCAL DEL MOCK
 * ============================================================================
 *
 * Actualiza las posiciones después de un movimiento.
 */
function normalizeOrder(
  operations: ProduccionOperacionMock[],
): ProduccionOperacionMock[] {
  return PRODUCCION_COLUMNAS.flatMap((column) =>
    operations
      .filter((operation) => operation.estado === column.id)
      .sort((a, b) => a.order - b.order)
      .map((operation, index) => ({
        ...operation,
        order: index,
      })),
  );
}

/**
 * Página principal de Producción.
 */
export default function ProduccionPage() {
  /**
   * ==========================================================================
   * ESTADO LOCAL DEL MOCK
   * ==========================================================================
   *
   * Este estado existe únicamente para probar el comportamiento del Kanban.
   *
   * El backend no recibe ninguna petición.
   */
  const [operations, setOperations] =
    useState<ProduccionOperacionMock[]>(MOCK_OPERACIONES);

  /**
   * ==========================================================================
   * DRAG & DROP
   * ==========================================================================
   *
   * Aquí simulamos lo que posteriormente hará la API real.
   */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourceStatus = source.droppableId as ProduccionOperacionEstado;

    const destinationStatus =
      destination.droppableId as ProduccionOperacionEstado;

    /**
     * Si solamente cambió la posición dentro de la misma columna,
     * también actualizamos el orden local.
     */
    if (
      sourceStatus === destinationStatus &&
      source.index === destination.index
    ) {
      return;
    }

    setOperations((currentOperations) => {
      const movingOperation = currentOperations.find(
        (operation) => String(operation.id) === draggableId,
      );

      if (!movingOperation) {
        return currentOperations;
      }

      /**
       * ----------------------------------------------------------------------
       * MISMA COLUMNA
       * ----------------------------------------------------------------------
       */
      if (sourceStatus === destinationStatus) {
        const columnOperations = currentOperations
          .filter((operation) => operation.estado === sourceStatus)
          .sort((a, b) => a.order - b.order);

        const movingIndex = columnOperations.findIndex(
          (operation) => operation.id === movingOperation.id,
        );

        if (movingIndex === -1) {
          return currentOperations;
        }

        const nextColumnOperations = [...columnOperations];

        const [removed] = nextColumnOperations.splice(movingIndex, 1);

        nextColumnOperations.splice(destination.index, 0, removed);

        const reordered = currentOperations.map((operation) => {
          const nextIndex = nextColumnOperations.findIndex(
            (item) => item.id === operation.id,
          );

          if (nextIndex === -1) {
            return operation;
          }

          return {
            ...operation,
            order: nextIndex,
          };
        });

        return normalizeOrder(reordered);
      }

      /**
       * ----------------------------------------------------------------------
       * CAMBIO DE COLUMNA
       * ----------------------------------------------------------------------
       *
       * En la prueba respetamos el flujo real del backend.
       */
      if (!isAllowedTransition(sourceStatus, destinationStatus)) {
        console.debug("[Producción] Transición no permitida en el mock:", {
          operationId: draggableId,
          from: sourceStatus,
          to: destinationStatus,
        });

        return currentOperations;
      }

      /**
       * Operaciones de la columna origen, sin la tarjeta movida.
       */
      const sourceOperations = currentOperations
        .filter(
          (operation) =>
            operation.estado === sourceStatus &&
            operation.id !== movingOperation.id,
        )
        .sort((a, b) => a.order - b.order);

      /**
       * Operaciones de la columna destino.
       */
      const destinationOperations = currentOperations
        .filter((operation) => operation.estado === destinationStatus)
        .sort((a, b) => a.order - b.order);

      /**
       * Insertamos la tarjeta en la posición elegida.
       */
      destinationOperations.splice(destination.index, 0, {
        ...movingOperation,
        estado: destinationStatus,
      });

      /**
       * Reconstruimos todas las operaciones respetando
       * el orden visual de cada columna.
       */
      const nextOperations = [
        ...currentOperations.filter(
          (operation) =>
            operation.estado !== sourceStatus &&
            operation.estado !== destinationStatus,
        ),
        ...sourceOperations.map((operation, index) => ({
          ...operation,
          order: index,
        })),
        ...destinationOperations.map((operation, index) => ({
          ...operation,
          order: index,
        })),
      ];

      return normalizeOrder(nextOperations);
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Producción"
        description="Tablero de producción en proceso"
        breadcrumb={[
          {
            label: "Producción",
          },
        ]}
      />

      <KanbanBoard onDragEnd={handleDragEnd}>
        {PRODUCCION_COLUMNAS.map((column) => {
          const columnOperations = operations
            .filter((operation) => operation.estado === column.id)
            .sort((a, b) => a.order - b.order);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnOperations.length}
              emptyMessage="Sin producción"
            >
              {columnOperations.map((operation, index) => (
                <KanbanCard
                  key={operation.id}
                  id={String(operation.id)}
                  index={index}
                >
                  <ProduccionCardContent operation={operation} />
                </KanbanCard>
              ))}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </div>
  );
}
