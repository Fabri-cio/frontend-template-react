/**
 * ============================================================================
 * CONSTANTES DE PRODUCCIÓN
 * ============================================================================
 *
 * Configuración visual y etiquetas específicas del módulo de Producción.
 *
 * IMPORTANTE:
 *
 * Este archivo pertenece exclusivamente a la feature Producción.
 *
 * Los componentes genéricos de `src/components/ui` no deben conocer:
 *
 * - estados de producción
 * - tipos de proceso
 * - prioridades
 * - resultados de calidad
 * - estados de equipos
 *
 * Aquí mantenemos esa información para que las páginas puedan concentrarse
 * en composición e interacción.
 */

import {
  CheckCircle2,
  Clock,
  Layers,
  Printer,
  Scissors,
  Waves,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type {
  CalidadResultado,
  EquipoMockEstado,
  OrdenProduccionMockEstado,
  Prioridad,
  ProcesoMockEstado,
  ProduccionKanbanEstado,
  TipoProceso,
} from "./produccion.page.types";

/**
 * ============================================================================
 * PROCESOS
 * ============================================================================
 */

export const PROCESO_LABELS: Record<TipoProceso, string> = {
  extrusion: "Extrusión",
  flexografia: "Flexografía",
  confeccion: "Confección",
  bobinado: "Bobinado",
};

export const PROCESO_ICONS: Record<TipoProceso, LucideIcon> = {
  extrusion: Waves,
  flexografia: Printer,
  confeccion: Scissors,
  bobinado: Layers,
};

/**
 * Tipo de equipo esperado por cada proceso.
 *
 * Se utilizará en la pantalla de planificación para filtrar los equipos
 * disponibles.
 */

export const PROCESO_EQUIPO_LABELS: Record<TipoProceso, string> = {
  extrusion: "Extrusora",
  flexografia: "Flexográfica",
  confeccion: "Confeccionadora",
  bobinado: "Bobinadora",
};

/**
 * Orden de aparición de los procesos cuando el usuario agrega uno nuevo.
 */

export const PROCESOS_DISPONIBLES: TipoProceso[] = [
  "extrusion",
  "flexografia",
  "confeccion",
  "bobinado",
];

/**
 * ============================================================================
 * ESTADOS DEL PASO DE PRODUCCIÓN
 * ============================================================================
 */

export const PROCESO_ESTADO_LABELS: Record<ProcesoMockEstado, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  finalizado: "Finalizado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

/**
 * Clases de color visual para los estados.
 *
 * Utilizamos directamente las paletas corporativas agregadas a globals.css.
 */

export const PROCESO_ESTADO_COLORS: Record<ProcesoMockEstado, string> = {
  pendiente: "bg-slate-50 text-slate-500 border-slate-200",

  en_proceso: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

  finalizado: "bg-amber-50 text-amber-700 border-amber-300",

  aprobado: "bg-brand-50 text-brand-700 border-brand-300",

  rechazado: "bg-danger-50 text-danger-700 border-danger-300",
};

export const PROCESO_ESTADO_DOTS: Record<ProcesoMockEstado, string> = {
  pendiente: "bg-slate-300",
  en_proceso: "bg-inplaz-500",
  finalizado: "bg-amber-500",
  aprobado: "bg-brand-500",
  rechazado: "bg-danger-500",
};

/**
 * Iconos utilizados en la línea de progreso de la orden.
 */

export const PROCESO_ESTADO_ICONS: Record<ProcesoMockEstado, LucideIcon> = {
  pendiente: Clock,
  en_proceso: Clock,
  finalizado: Clock,
  aprobado: CheckCircle2,
  rechazado: XCircle,
};

/**
 * ============================================================================
 * ESTADOS DEL KANBAN
 * ============================================================================
 */

export const PRODUCCION_ESTADOS: ProduccionKanbanEstado[] = [
  "pendiente",
  "en_proceso",
  "completada",
  "cancelada",
];

export const PRODUCCION_ESTADO_LABELS: Record<ProduccionKanbanEstado, string> =
  {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completada: "Completada",
    cancelada: "Cancelada",
  };

export const PRODUCCION_ESTADO_COLORS: Record<ProduccionKanbanEstado, string> =
  {
    pendiente: "bg-slate-50 text-slate-600 border-slate-200",

    en_proceso: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

    completada: "bg-brand-50 text-brand-700 border-brand-300",

    cancelada: "bg-danger-50 text-danger-700 border-danger-300",
  };

/**
 * ============================================================================
 * PRIORIDAD
 * ============================================================================
 */

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente",
};

export const PRIORIDAD_COLORS: Record<Prioridad, string> = {
  baja: "bg-slate-50 text-slate-600 border-slate-200",

  media: "bg-inplaz-50 text-inplaz-700 border-inplaz-200",

  alta: "bg-amber-50 text-amber-700 border-amber-200",

  urgente: "bg-danger-50 text-danger-700 border-danger-200",
};

export const PRIORIDAD_DOTS: Record<Prioridad, string> = {
  baja: "bg-slate-400",
  media: "bg-inplaz-500",
  alta: "bg-amber-500",
  urgente: "bg-danger-500",
};

/**
 * ============================================================================
 * ESTADOS DE LA ORDEN
 * ============================================================================
 */

export const ORDEN_ESTADO_LABELS: Record<OrdenProduccionMockEstado, string> = {
  viable: "Viable",
  en_planificacion: "En planificación",
  ruta_confirmada: "Ruta confirmada",
  materia_prima_lista: "Materia prima lista",
  en_produccion: "En producción",
  completado: "Completado",
};

export const ORDEN_ESTADO_COLORS: Record<OrdenProduccionMockEstado, string> = {
  viable: "bg-brand-50 text-brand-700 border-brand-300",

  en_planificacion: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

  ruta_confirmada: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

  materia_prima_lista: "bg-brand-50 text-brand-700 border-brand-300",

  en_produccion: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

  completado: "bg-brand-50 text-brand-700 border-brand-300",
};

/**
 * ============================================================================
 * RESULTADOS DE CALIDAD
 * ============================================================================
 */

export const CALIDAD_RESULTADO_LABELS: Record<CalidadResultado, string> = {
  cumple: "Cumple",
  observado: "Observado",
  no_cumple: "No cumple",
};

export const CALIDAD_RESULTADO_COLORS: Record<CalidadResultado, string> = {
  cumple: "bg-brand-100 text-brand-700 border-brand-300",

  observado: "bg-amber-100 text-amber-700 border-amber-300",

  no_cumple: "bg-danger-100 text-danger-700 border-danger-300",
};

/**
 * ============================================================================
 * ESTADOS DE EQUIPOS
 * ============================================================================
 */

export const EQUIPO_ESTADO_LABELS: Record<EquipoMockEstado, string> = {
  disponible: "Disponible",
  ocupado: "Ocupado",
  mantenimiento: "Mantenimiento",
  fuera_servicio: "Fuera de servicio",
};

export const EQUIPO_ESTADO_COLORS: Record<EquipoMockEstado, string> = {
  disponible: "bg-brand-50 text-brand-700 border-brand-300",

  ocupado: "bg-inplaz-50 text-inplaz-700 border-inplaz-300",

  mantenimiento: "bg-amber-50 text-amber-700 border-amber-300",

  fuera_servicio: "bg-danger-50 text-danger-700 border-danger-300",
};

/**
 * ============================================================================
 * TEXTOS GENERALES DE LA FEATURE
 * ============================================================================
 */

export const PRODUCCION_TEXTS = {
  pageTitle: "Producción",
  pageDescription: "Tablero de producción en proceso",

  viableTitle: "Solicitudes viables - Pendientes de planificación",

  show: "Mostrar",
  hide: "Ocultar",

  noProduction: "Sin producción",

  startProduction: "Iniciar producción",
  finishProcess: "Finalizar proceso",
  registerQuality: "Registrar control de calidad",
  continueNext: "Continuar al siguiente proceso",

  finishedProcess: "Proceso finalizado",

  addProcess: "Agregar proceso",
  confirmPlanning: "Confirmar planificación",

  addMaterial: "Agregar",
  saveMaterial: "Guardar materia prima",

  readyToProduce: "Listo para producir",
  putIntoProduction: "Poner a producir",
} as const;
