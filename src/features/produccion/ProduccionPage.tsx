import type { DropResult } from "@hello-pangea/dnd";
import { Clock, Factory, Plus, User } from "lucide-react";

import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "../../components/ui/kanban";

import { Avatar, Badge, Button, PageHeader, ProgressBar } from "../../components/ui";

// ============================================================================
// CONEXIÓN REAL — TEMPORALMENTE COMENTADA
// ============================================================================
//
// Cuando dejemos el mock, descomentaremos:
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
// De esta forma:
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

// import { useProduccionOperaciones } from "./produccion.hooks";

import type { ProduccionOperacionEstado } from "./produccion.types";

/**
 * ============================================================================
 * CONFIGURACIÓN DEL TABLERO
 * ============================================================================
 *
 * Los IDs de las columnas corresponden a los estados reales
 * de ProduccionOperacion en el backend.
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
 * MOCK TEMPORAL
 * ============================================================================
 *
 * Este modelo es SOLO para la prueba visual del tablero.
 *
 * Los campos adicionales:
 *
 * - pedidoNumero
 * - maquinaNombre
 * - operador
 * - prioridad
 * - cantidad_planificada
 * - tiempoTranscurrido
 * - tiempoEstimado
 *
 * NO forman parte actualmente de ProduccionOperacion del backend.
 *
 * Cuando conectemos la API real, este mock se eliminará.
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

  // Datos visuales temporales del mock.
  pedidoNumero: string;
  maquinaNombre: string;
  operador: string;
  prioridad: "baja" | "normal" | "alta" | "urgente";
  cantidad_planificada: number;
  tiempoTranscurrido: string;
  tiempoEstimado: string;
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
    cantidad_producida: "0",
    observaciones: "",
    created_at: "2026-09-19T10:00:00",
    updated_at: "2026-09-19T10:00:00",

    pedidoNumero: "OP-1001",
    maquinaNombre: "Extrusora A",
    operador: "Juan Pérez",
    prioridad: "alta",
    cantidad_planificada: 500,
    tiempoTranscurrido: "0h",
    tiempoEstimado: "4h",
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
    cantidad_producida: "120",
    observaciones: "",
    created_at: "2026-09-19T10:10:00",
    updated_at: "2026-09-19T10:10:00",

    pedidoNumero: "OP-1002",
    maquinaNombre: "Extrusora B",
    operador: "María López",
    prioridad: "normal",
    cantidad_planificada: 600,
    tiempoTranscurrido: "1h",
    tiempoEstimado: "4h",
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
  },
];

/**
 * Obtiene la información visual asociada a una prioridad.
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
 * Formatea fechas recibidas desde el backend.
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
 * Formatea cantidades numéricas.
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
 *
 * Aquí sí podemos usar la cantidad planificada porque el mock
 * temporal incluye ese dato.
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
 * CONTENIDO DE LA TARJETA
 * ============================================================================
 *
 * Este componente sí conoce Producción.
 *
 * `KanbanCard`, en cambio, sigue siendo completamente genérico.
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

  const progressVariant = progress === 100 ? "success" : "primary";

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
        variant={progressVariant}
        showLabel
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatQuantity(operation.cantidad_producida)} /{" "}
          {formatQuantity(operation.cantidad_planificada)}
        </span>

        <span>{progress}%</span>
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
 * PÁGINA
 * ============================================================================
 */
export default function ProduccionPage() {
  /**
   * ========================================================================
   * MOCK TEMPORAL
   * ========================================================================
   *
   * Por ahora NO consultamos React Query.
   *
   * La página utiliza:
   *
   * MOCK_OPERACIONES
   *
   * para poder desarrollar y revisar visualmente el Kanban.
   */

  const operations = MOCK_OPERACIONES;

  /**
   * ========================================================================
   * CONEXIÓN REAL — COMENTADA
   * ========================================================================
   *
   * Cuando queramos conectar el backend:
   *
   * const {
   *   data: operations = [],
   *   isLoading,
   * } = useProduccionOperaciones();
   *
   * if (isLoading) {
   *   return (
   *     <LoadingState message="Cargando producción..." />
   *   );
   * }
   */

  /**
   * Actualmente el drag & drop solamente muestra en consola
   * qué operación se movió.
   *
   * Todavía no cambiamos el backend.
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      return;
    }

    console.debug("[Producción] Movimiento de operación:", {
      operationId: result.draggableId,
      from: result.source.droppableId,
      to: result.destination.droppableId,
      destinationIndex: result.destination.index,
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
        actions={
          <Button variant="outline">
            <Plus className="size-4" />
            Nueva operación
          </Button>
        }
      />

      <KanbanBoard onDragEnd={handleDragEnd}>
        {PRODUCCION_COLUMNAS.map((column) => {
          const columnOperations = operations.filter(
            (operation) => operation.estado === column.id,
          );

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
