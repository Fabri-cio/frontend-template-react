import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { CheckCircle2, Clock, Factory, ShieldCheck } from "lucide-react";

import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "../../components/ui/kanban";

import {
  Avatar,
  Badge,
  PageHeader,
  ProgressBar,
  Tabs,
} from "../../components/ui";

import type {
  ProduccionOperacion,
  ProduccionOperacionEstado,
} from "./produccion.types";

// ============================================================================
// CONEXIÓN REAL — TEMPORALMENTE COMENTADA
// ============================================================================
//
// Cuando dejemos de usar el mock:
//
// import { useProduccionOperaciones } from "./produccion.hooks";
//
// Después podremos reemplazar:
//
// const [operations, setOperations] = ...
//
// por:
//
// const {
//   data: operations = [],
//   isLoading,
// } = useProduccionOperaciones();
//
// ============================================================================

/**
 * ============================================================================
 * ÁREAS DE PRODUCCIÓN
 * ============================================================================
 *
 * Estas son las áreas que actualmente participan del flujo de producción
 * definido por Viabilidad:
 *
 * Extrusión
 * Flexografía
 * Confección
 *
 * Refilado existe en el backend de Recursos/Calidad, pero todavía no forma
 * parte de la ruta que genera automáticamente Producción.
 */
type ProduccionArea = "extrusion" | "flexografia" | "confeccion";

type ProduccionTab = ProduccionArea;

/**
 * ============================================================================
 * COLUMNAS DEL KANBAN
 * ============================================================================
 *
 * Corresponden directamente al campo:
 *
 * ProduccionOperacion.estado
 */
const PRODUCCION_COLUMNAS: Array<{
  id: ProduccionOperacionEstado;
  title: string;
}> = [
  {
    id: "pendiente",
    title: "Pendiente",
  },
  {
    id: "en_proceso",
    title: "En proceso",
  },
  {
    id: "completada",
    title: "Completada",
  },
  {
    id: "cancelada",
    title: "Cancelada",
  },
];

/**
 * ============================================================================
 * MOCK — DATOS RESUELTOS DE PRESENTACIÓN
 * ============================================================================
 *
 * El backend real separa información en varias entidades:
 *
 * ProduccionOperacion
 * ├── equipo
 * ├── orden_ruta
 * ├── ruta_operacion
 * └── resultado_viabilidad
 *
 * OrdenProduccion
 * ├── numero
 * ├── prioridad
 * └── cantidad_planificada
 *
 * Equipo
 * └── nombre
 *
 * ControlCalidad
 * └── resultado del control final
 *
 * Para que el mock sea cómodo de utilizar, aquí mantenemos una representación
 * enriquecida de esas relaciones.
 *
 * Estos campos NO significan que existan directamente en el serializer de
 * ProduccionOperacion.
 */
type ProduccionOperacionMock = ProduccionOperacion & {
  /**
   * Área derivada de la ruta/proceso.
   */
  area: ProduccionArea;

  /**
   * OrdenProduccion.numero
   */
  ordenProduccionNumero: string;

  /**
   * Equipo.nombre
   */
  maquinaNombre: string;

  /**
   * OrdenProduccion.prioridad
   */
  prioridad: "baja" | "normal" | "alta" | "urgente";

  /**
   * OrdenProduccion.cantidad_planificada
   */
  cantidadPlanificada: number;

  /**
   * RutaOperacion.tiempo_estandar_min
   */
  tiempoEstandarMin: number;

  /**
   * Dato derivado de ControlCalidad.
   *
   * null = todavía no aplica/no se ha realizado.
   */
  calidadFinalAprobada: boolean | null;

  /**
   * Posición local utilizada exclusivamente por el Kanban mock.
   */
  order: number;
};

/**
 * ============================================================================
 * OPERACIONES MOCK
 * ============================================================================
 *
 * Las operaciones ahora representan rutas reales.
 *
 * OP-1001
 * ├── Op 1 → Extrusión
 * ├── Op 2 → Flexografía
 * └── Op 3 → Confección
 *
 * OP-1002
 * ├── Op 1 → Extrusión
 * └── Op 2 → Confección
 *
 * OP-1003
 * └── Op 1 → Extrusión
 *
 * OP-1004
 * ├── Op 1 → Extrusión
 * └── Op 2 → Flexografía
 */
const MOCK_OPERACIONES: ProduccionOperacionMock[] = [
  // --------------------------------------------------------------------------
  // OP-1001 — Extrusión completada
  // --------------------------------------------------------------------------
  {
    id: 1,

    orden_ruta: 500,
    ruta_operacion: 101,
    resultado_viabilidad: 201,
    equipo: 1,

    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T08:00:00",
    fecha_inicio_real: "2026-09-20T08:05:00",

    fecha_fin_planificada: "2026-09-20T12:00:00",
    fecha_fin_real: "2026-09-20T11:50:00",

    estado: "completada",

    cantidad_producida: "500",

    observaciones: "Extrusión completada correctamente.",

    created_at: "2026-09-19T10:00:00",
    updated_at: "2026-09-20T11:50:00",

    area: "extrusion",
    ordenProduccionNumero: "OP-1001",
    maquinaNombre: "Extrusora A",
    prioridad: "alta",
    cantidadPlanificada: 500,
    tiempoEstandarMin: 240,
    calidadFinalAprobada: true,

    order: 0,
  },

  // --------------------------------------------------------------------------
  // OP-1001 — Flexografía en proceso
  // --------------------------------------------------------------------------
  {
    id: 2,

    orden_ruta: 500,
    ruta_operacion: 102,
    resultado_viabilidad: 202,
    equipo: 3,

    numero_operacion: 2,

    fecha_inicio_planificada: "2026-09-20T12:00:00",
    fecha_inicio_real: "2026-09-20T12:10:00",

    fecha_fin_planificada: "2026-09-20T18:00:00",
    fecha_fin_real: null,

    estado: "en_proceso",

    cantidad_producida: "325",

    observaciones: "Producción de impresión en curso.",

    created_at: "2026-09-19T10:10:00",
    updated_at: "2026-09-20T15:00:00",

    area: "flexografia",
    ordenProduccionNumero: "OP-1001",
    maquinaNombre: "Flexográfica A",
    prioridad: "alta",
    cantidadPlanificada: 500,
    tiempoEstandarMin: 360,
    calidadFinalAprobada: null,

    order: 0,
  },

  // --------------------------------------------------------------------------
  // OP-1001 — Confección pendiente
  // --------------------------------------------------------------------------
  {
    id: 3,

    orden_ruta: 500,
    ruta_operacion: 103,
    resultado_viabilidad: 203,
    equipo: 5,

    numero_operacion: 3,

    fecha_inicio_planificada: "2026-09-20T18:00:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-20T23:00:00",
    fecha_fin_real: null,

    estado: "pendiente",

    cantidad_producida: "0",

    observaciones: "",

    created_at: "2026-09-19T10:20:00",
    updated_at: "2026-09-19T10:20:00",

    area: "confeccion",
    ordenProduccionNumero: "OP-1001",
    maquinaNombre: "Confeccionadora A",
    prioridad: "alta",
    cantidadPlanificada: 500,
    tiempoEstandarMin: 300,
    calidadFinalAprobada: null,

    order: 0,
  },

  // --------------------------------------------------------------------------
  // OP-1002 — Extrusión completada
  // --------------------------------------------------------------------------
  {
    id: 4,

    orden_ruta: 501,
    ruta_operacion: 104,
    resultado_viabilidad: 204,
    equipo: 2,

    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T07:30:00",
    fecha_inicio_real: "2026-09-20T07:35:00",

    fecha_fin_planificada: "2026-09-20T11:30:00",
    fecha_fin_real: "2026-09-20T11:20:00",

    estado: "completada",

    cantidad_producida: "600",

    observaciones: "Extrusión completada.",

    created_at: "2026-09-19T10:30:00",
    updated_at: "2026-09-20T11:20:00",

    area: "extrusion",
    ordenProduccionNumero: "OP-1002",
    maquinaNombre: "Extrusora B",
    prioridad: "normal",
    cantidadPlanificada: 600,
    tiempoEstandarMin: 240,
    calidadFinalAprobada: true,

    order: 1,
  },

  // --------------------------------------------------------------------------
  // OP-1002 — Confección en proceso
  // --------------------------------------------------------------------------
  {
    id: 5,

    orden_ruta: 501,
    ruta_operacion: 105,
    resultado_viabilidad: 205,
    equipo: 6,

    numero_operacion: 2,

    fecha_inicio_planificada: "2026-09-20T12:00:00",
    fecha_inicio_real: "2026-09-20T12:05:00",

    fecha_fin_planificada: "2026-09-20T18:00:00",
    fecha_fin_real: null,

    estado: "en_proceso",

    cantidad_producida: "280",

    observaciones: "Confección en curso.",

    created_at: "2026-09-19T10:40:00",
    updated_at: "2026-09-20T15:10:00",

    area: "confeccion",
    ordenProduccionNumero: "OP-1002",
    maquinaNombre: "Confeccionadora B",
    prioridad: "normal",
    cantidadPlanificada: 600,
    tiempoEstandarMin: 360,
    calidadFinalAprobada: null,

    order: 1,
  },

  // --------------------------------------------------------------------------
  // OP-1003 — Extrusión pendiente
  // --------------------------------------------------------------------------
  {
    id: 6,

    orden_ruta: 502,
    ruta_operacion: 106,
    resultado_viabilidad: 206,
    equipo: 1,

    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T16:00:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-20T20:00:00",
    fecha_fin_real: null,

    estado: "pendiente",

    cantidad_producida: "0",

    observaciones: "",

    created_at: "2026-09-19T11:00:00",
    updated_at: "2026-09-19T11:00:00",

    area: "extrusion",
    ordenProduccionNumero: "OP-1003",
    maquinaNombre: "Extrusora A",
    prioridad: "urgente",
    cantidadPlanificada: 400,
    tiempoEstandarMin: 240,
    calidadFinalAprobada: null,

    order: 2,
  },

  // --------------------------------------------------------------------------
  // OP-1003 — Operación cancelada
  // --------------------------------------------------------------------------
  {
    id: 7,

    orden_ruta: 503,
    ruta_operacion: 107,
    resultado_viabilidad: 207,
    equipo: 2,

    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-19T08:00:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-19T12:00:00",
    fecha_fin_real: null,

    estado: "cancelada",

    cantidad_producida: "0",

    observaciones: "Operación cancelada por cambio de especificación.",

    created_at: "2026-09-18T09:00:00",
    updated_at: "2026-09-19T09:00:00",

    area: "extrusion",
    ordenProduccionNumero: "OP-1004",
    maquinaNombre: "Extrusora B",
    prioridad: "baja",
    cantidadPlanificada: 300,
    tiempoEstandarMin: 240,
    calidadFinalAprobada: null,

    order: 0,
  },

  // --------------------------------------------------------------------------
  // OP-1004 — Extrusión completada, pero calidad final NO aprobada
  // --------------------------------------------------------------------------
  {
    id: 8,

    orden_ruta: 504,
    ruta_operacion: 108,
    resultado_viabilidad: 208,
    equipo: 1,

    numero_operacion: 1,

    fecha_inicio_planificada: "2026-09-20T06:00:00",
    fecha_inicio_real: "2026-09-20T06:05:00",

    fecha_fin_planificada: "2026-09-20T10:00:00",
    fecha_fin_real: "2026-09-20T09:50:00",

    estado: "completada",

    cantidad_producida: "450",

    observaciones:
      "Operación completada. Pendiente de liberación por control de calidad.",

    created_at: "2026-09-19T11:10:00",
    updated_at: "2026-09-20T09:50:00",

    area: "extrusion",
    ordenProduccionNumero: "OP-1005",
    maquinaNombre: "Extrusora A",
    prioridad: "alta",
    cantidadPlanificada: 450,
    tiempoEstandarMin: 240,
    calidadFinalAprobada: false,

    order: 3,
  },

  // --------------------------------------------------------------------------
  // OP-1004 — Flexografía bloqueada por calidad
  // --------------------------------------------------------------------------
  {
    id: 9,

    orden_ruta: 504,
    ruta_operacion: 109,
    resultado_viabilidad: 209,
    equipo: 4,

    numero_operacion: 2,

    fecha_inicio_planificada: "2026-09-20T10:00:00",
    fecha_inicio_real: null,

    fecha_fin_planificada: "2026-09-20T16:00:00",
    fecha_fin_real: null,

    estado: "pendiente",

    cantidad_producida: "0",

    observaciones: "Esperando aprobación del control de calidad final.",

    created_at: "2026-09-19T11:20:00",
    updated_at: "2026-09-20T09:50:00",

    area: "flexografia",
    ordenProduccionNumero: "OP-1005",
    maquinaNombre: "Flexográfica B",
    prioridad: "alta",
    cantidadPlanificada: 450,
    tiempoEstandarMin: 360,
    calidadFinalAprobada: null,

    order: 1,
  },
];

/**
 * ============================================================================
 * TRANSICIONES DEL MOCK
 * ============================================================================
 *
 * Flujo controlado por los servicios reales:
 *
 * pendiente
 *   ├── en_proceso
 *   └── cancelada
 *
 * en_proceso
 *   ├── completada
 *   └── cancelada
 *
 * completada
 *   └── sin transición
 *
 * cancelada
 *   └── sin transición
 */
const ALLOWED_TRANSITIONS: Record<
  ProduccionOperacionEstado,
  ProduccionOperacionEstado[]
> = {
  pendiente: ["en_proceso", "cancelada"],
  en_proceso: ["completada", "cancelada"],
  completada: [],
  cancelada: [],
};

/**
 * Comprueba si existe la transición de estado.
 */
function isAllowedTransition(
  from: ProduccionOperacionEstado,
  to: ProduccionOperacionEstado,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * ============================================================================
 * FORMATEO DE ETIQUETAS DE ÁREA
 * ============================================================================
 */
function getAreaLabel(area: ProduccionArea): string {
  const labels: Record<ProduccionArea, string> = {
    extrusion: "Extrusión",
    flexografia: "Flexografía",
    confeccion: "Confección",
  };

  return labels[area];
}

/**
 * ============================================================================
 * FORMATEO DE PRIORIDADES
 * ============================================================================
 */
function getPriorityConfig(priority: ProduccionOperacionMock["prioridad"]) {
  const config = {
    baja: {
      label: "Baja",
      variant: "secondary" as const,
    },
    normal: {
      label: "Normal",
      variant: "info" as const,
    },
    alta: {
      label: "Alta",
      variant: "warning" as const,
    },
    urgente: {
      label: "Urgente",
      variant: "destructive" as const,
    },
  };

  return config[priority];
}

/**
 * ============================================================================
 * FORMATEO DE FECHAS
 * ============================================================================
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
 * ============================================================================
 * FORMATEO DE CANTIDADES
 * ============================================================================
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
 * ============================================================================
 * PROGRESO
 * ============================================================================
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
 * DURACIÓN
 * ============================================================================
 *
 * Para una operación:
 *
 * pendiente:
 *   No existe tiempo transcurrido.
 *
 * en_proceso:
 *   ahora - fecha_inicio_real
 *
 * completada:
 *   fecha_fin_real - fecha_inicio_real
 *
 * cancelada:
 *   Si tuvo inicio real, calculamos hasta fecha_fin_real si existe.
 */
function calculateElapsedMinutes(
  operation: ProduccionOperacionMock,
): number | null {
  if (!operation.fecha_inicio_real) {
    return null;
  }

  const start = new Date(operation.fecha_inicio_real);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = operation.fecha_fin_real
    ? new Date(operation.fecha_fin_real)
    : new Date();

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  const elapsed = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 60_000),
  );

  return elapsed;
}

/**
 * Formatea minutos como:
 *
 * 45m
 * 2h
 * 2h 30m
 */
function formatDuration(minutes: number | null): string {
  if (minutes === null) {
    return "Sin iniciar";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * ============================================================================
 * REGLA DE SECUENCIA
 * ============================================================================
 *
 * El servicio real iniciar_operacion() exige:
 *
 * - Si numero_operacion === 1:
 *     puede iniciar directamente.
 *
 * - Si numero_operacion > 1:
 *     debe existir la operación anterior de la misma OrdenRuta.
 *
 *     Además:
 *     - operación anterior completada
 *     - control de calidad FINAL aprobado
 *
 * Esta función reproduce esa regla en el mock.
 */
function canStartOperation(
  operation: ProduccionOperacionMock,
  operations: ProduccionOperacionMock[],
): boolean {
  if (operation.numero_operacion === 1) {
    return true;
  }

  const previousOperation = operations.find(
    (candidate) =>
      candidate.orden_ruta === operation.orden_ruta &&
      candidate.numero_operacion === operation.numero_operacion - 1,
  );

  if (!previousOperation) {
    return false;
  }

  return (
    previousOperation.estado === "completada" &&
    previousOperation.calidadFinalAprobada === true
  );
}

/**
 * Devuelve el motivo por el que una operación pendiente todavía no puede
 * iniciar.
 */
function getStartBlockMessage(
  operation: ProduccionOperacionMock,
  operations: ProduccionOperacionMock[],
): string | null {
  if (operation.estado !== "pendiente") {
    return null;
  }

  if (operation.numero_operacion === 1) {
    return null;
  }

  const previousOperation = operations.find(
    (candidate) =>
      candidate.orden_ruta === operation.orden_ruta &&
      candidate.numero_operacion === operation.numero_operacion - 1,
  );

  if (!previousOperation) {
    return "Operación anterior no encontrada.";
  }

  if (previousOperation.estado !== "completada") {
    return "Esperando finalización de la operación anterior.";
  }

  if (previousOperation.calidadFinalAprobada !== true) {
    return "Esperando aprobación de calidad final.";
  }

  return null;
}

/**
 * ============================================================================
 * TARJETA DE PRODUCCIÓN
 * ============================================================================
 */
function ProduccionCardContent({
  operation,
  allOperations,
}: {
  operation: ProduccionOperacionMock;
  allOperations: ProduccionOperacionMock[];
}) {
  const priority = getPriorityConfig(operation.prioridad);

  const progress = calculateProgress(
    operation.cantidad_producida,
    operation.cantidadPlanificada,
  );

  const elapsedMinutes = calculateElapsedMinutes(operation);

  const startBlockMessage = getStartBlockMessage(operation, allOperations);

  const mostrarBloqueo =
    operation.estado === "pendiente" && startBlockMessage !== null;

  return (
    <div className="space-y-3">
      {/* ------------------------------------------------------------------- */}
      {/* CABECERA                                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {operation.ordenProduccionNumero}
          </p>

          <p className="text-xs text-muted-foreground">
            Operación #{operation.numero_operacion}
          </p>
        </div>

        <Badge variant={priority.variant} className="shrink-0">
          {priority.label}
        </Badge>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ÁREA / MÁQUINA                                                     */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Factory className="size-3.5 shrink-0" />

          <span className="truncate">{operation.maquinaNombre}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Área:{" "}
          <span className="text-foreground">
            {getAreaLabel(operation.area)}
          </span>
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PROGRESO                                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-1.5">
        <ProgressBar
          value={Number(operation.cantidad_producida)}
          max={operation.cantidadPlanificada}
          variant={progress === 100 ? "success" : "primary"}
          showLabel
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatQuantity(operation.cantidad_producida)} /{" "}
            {formatQuantity(operation.cantidadPlanificada)}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TIEMPO                                                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3 shrink-0" />

          <span>{formatDuration(elapsedMinutes)}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Tiempo estándar:{" "}
          <span className="text-foreground">
            {formatDuration(operation.tiempoEstandarMin)}
          </span>
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* CALIDAD FINAL                                                      */}
      {/* ------------------------------------------------------------------- */}
      {operation.estado === "completada" &&
        operation.calidadFinalAprobada !== null && (
          <div className="border-t border-border pt-2">
            <div className="flex items-center gap-2">
              {operation.calidadFinalAprobada ? (
                <>
                  <ShieldCheck className="size-4 text-success" />

                  <span className="text-xs font-medium text-success">
                    Calidad final aprobada
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-warning" />

                  <span className="text-xs font-medium text-warning">
                    Calidad final pendiente
                  </span>
                </>
              )}
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------------- */}
      {/* BLOQUEO DE SECUENCIA                                               */}
      {/* ------------------------------------------------------------------- */}
      {mostrarBloqueo && (
        <div className="rounded-md bg-warning/10 px-2.5 py-2 text-xs text-warning">
          {startBlockMessage}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* EQUIPO                                                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-t border-border pt-2">
        <Avatar name={operation.maquinaNombre} size="sm" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            {operation.maquinaNombre}
          </p>

          <p className="text-xs text-muted-foreground">
            Equipo #{operation.equipo}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* FECHAS                                                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
        <p>
          Inicio planificado:{" "}
          <span className="text-foreground">
            {formatDateTime(operation.fecha_inicio_planificada)}
          </span>
        </p>

        <p>
          Inicio real:{" "}
          <span className="text-foreground">
            {formatDateTime(operation.fecha_inicio_real)}
          </span>
        </p>

        <p>
          Fin planificado:{" "}
          <span className="text-foreground">
            {formatDateTime(operation.fecha_fin_planificada)}
          </span>
        </p>

        {operation.fecha_fin_real && (
          <p>
            Fin real:{" "}
            <span className="text-foreground">
              {formatDateTime(operation.fecha_fin_real)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * NORMALIZACIÓN DEL ORDEN
 * ============================================================================
 *
 * El orden del Kanban es local y se mantiene separado por:
 *
 * área + estado
 */
function normalizeOrder(
  operations: ProduccionOperacionMock[],
): ProduccionOperacionMock[] {
  const grouped = new Map<string, ProduccionOperacionMock[]>();

  for (const operation of operations) {
    const key = `${operation.area}:${operation.estado}`;

    const group = grouped.get(key) ?? [];

    group.push(operation);

    grouped.set(key, group);
  }

  for (const group of grouped.values()) {
    group.sort((a, b) => a.order - b.order);

    group.forEach((operation, index) => {
      operation.order = index;
    });
  }

  return [...operations];
}

/**
 * ============================================================================
 * PÁGINA PRINCIPAL
 * ============================================================================
 */
export default function ProduccionPage() {
  const [tab, setTab] = useState<ProduccionTab>("extrusion");

  /**
   * Estado local del mock.
   */
  const [operations, setOperations] = useState<ProduccionOperacionMock[]>(() =>
    normalizeOrder(MOCK_OPERACIONES),
  );

  /**
   * --------------------------------------------------------------------------
   * FILTRO POR ÁREA
   * --------------------------------------------------------------------------
   */
  const filteredOperations = operations.filter(
    (operation) => operation.area === tab,
  );

  /**
   * --------------------------------------------------------------------------
   * DRAG & DROP
   * --------------------------------------------------------------------------
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
     * Si no cambió de posición ni de columna, no hacemos nada.
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
          .filter(
            (operation) =>
              operation.area === tab && operation.estado === sourceStatus,
          )
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
       */
      if (!isAllowedTransition(sourceStatus, destinationStatus)) {
        console.debug("[Producción] Transición no permitida:", {
          operationId: movingOperation.id,
          from: sourceStatus,
          to: destinationStatus,
        });

        return currentOperations;
      }

      /**
       * ----------------------------------------------------------------------
       * REGLA DE INICIO
       * ----------------------------------------------------------------------
       *
       * Al pasar:
       *
       * pendiente -> en_proceso
       *
       * verificamos la secuencia de operaciones.
       */
      if (
        destinationStatus === "en_proceso" &&
        !canStartOperation(movingOperation, currentOperations)
      ) {
        console.debug("[Producción] La operación todavía no puede iniciar:", {
          operationId: movingOperation.id,
          orden_ruta: movingOperation.orden_ruta,
          numero_operacion: movingOperation.numero_operacion,
        });

        return currentOperations;
      }

      /**
       * ----------------------------------------------------------------------
       * OPERACIONES DEL ÁREA ACTIVA
       * ----------------------------------------------------------------------
       */
      const sourceOperations = currentOperations
        .filter(
          (operation) =>
            operation.area === tab &&
            operation.estado === sourceStatus &&
            operation.id !== movingOperation.id,
        )
        .sort((a, b) => a.order - b.order);

      const destinationOperations = currentOperations
        .filter(
          (operation) =>
            operation.area === tab && operation.estado === destinationStatus,
        )
        .sort((a, b) => a.order - b.order);

      /**
       * ----------------------------------------------------------------------
       * CAMBIOS QUE SIMULAN LOS SERVICIOS DEL BACKEND
       * ----------------------------------------------------------------------
       */
      const now = new Date().toISOString();

      let updatedMovingOperation: ProduccionOperacionMock | null = null;

      if (sourceStatus === "pendiente" && destinationStatus === "en_proceso") {
        updatedMovingOperation = {
          ...movingOperation,
          estado: "en_proceso",
          fecha_inicio_real: now,
          updated_at: now,
          order: destination.index,
        };
      } else if (
        sourceStatus === "en_proceso" &&
        destinationStatus === "completada"
      ) {
        updatedMovingOperation = {
          ...movingOperation,
          estado: "completada",
          fecha_fin_real: now,
          updated_at: now,
          order: destination.index,
        };
      } else {
        updatedMovingOperation = {
          ...movingOperation,
          estado: destinationStatus,
          updated_at: now,
          order: destination.index,
        };
      }

      /**
       * Insertamos la operación en destino.
       */
      destinationOperations.splice(
        destination.index,
        0,
        updatedMovingOperation,
      );

      /**
       * ----------------------------------------------------------------------
       * ACTUALIZAMOS EL ESTADO
       * ----------------------------------------------------------------------
       */
      const nextOperations = currentOperations.map((operation) => {
        /**
         * Operación que se está moviendo.
         */
        if (operation.id === movingOperation.id) {
          return updatedMovingOperation!;
        }

        /**
         * Operaciones que permanecen en origen.
         */
        const sourceIndex = sourceOperations.findIndex(
          (item) => item.id === operation.id,
        );

        if (sourceIndex !== -1) {
          return {
            ...operation,
            order: sourceIndex,
          };
        }

        /**
         * Operaciones que están en destino.
         */
        const destinationIndex = destinationOperations.findIndex(
          (item) => item.id === operation.id,
        );

        if (destinationIndex !== -1) {
          return {
            ...operation,
            order: destinationIndex,
          };
        }

        return operation;
      });

      return normalizeOrder(nextOperations);
    });
  };

  return (
    <div className="space-y-4">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER                                                               */}
      {/* -------------------------------------------------------------------- */}
      <PageHeader
        title="Producción"
        description="Tablero de seguimiento de operaciones de producción"
        breadcrumb={[
          {
            label: "Producción",
          },
        ]}
      />

      {/* -------------------------------------------------------------------- */}
      {/* TABS DE ÁREAS                                                        */}
      {/* -------------------------------------------------------------------- */}
      <Tabs
        value={tab}
        onChange={(value) => setTab(value as ProduccionTab)}
        items={[
          {
            value: "extrusion",
            label: "Extrusión",
          },
          {
            value: "flexografia",
            label: "Flexografía",
          },
          {
            value: "confeccion",
            label: "Confección",
          },
        ]}
      />

      {/* -------------------------------------------------------------------- */}
      {/* KANBAN                                                               */}
      {/* -------------------------------------------------------------------- */}
      <KanbanBoard onDragEnd={handleDragEnd}>
        {PRODUCCION_COLUMNAS.map((column) => {
          const columnOperations = filteredOperations
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
                  <ProduccionCardContent
                    operation={operation}
                    allOperations={operations}
                  />
                </KanbanCard>
              ))}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </div>
  );
}
