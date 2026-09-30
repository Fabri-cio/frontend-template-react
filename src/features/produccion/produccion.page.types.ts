/**
 * ============================================================================
 * TIPOS DE VISTA - MÓDULO DE PRODUCCIÓN
 * ============================================================================
 *
 * Estos tipos representan el modelo de datos que necesitan las pantallas
 * de Producción.
 *
 * IMPORTANTE:
 *
 * No sustituyen a `produccion.types.ts`.
 *
 * - produccion.types.ts
 *   Representa el contrato real del backend.
 *
 * - produccion.page.types.ts
 *   Representa el modelo visual/funcional de las páginas.
 *
 * Esta separación nos permite utilizar primero datos mock y posteriormente
 * conectar el backend mediante un adaptador sin modificar la UI.
 */

/**
 * ============================================================================
 * PROCESOS
 * ============================================================================
 */

export type TipoProceso =
  | "extrusion"
  | "flexografia"
  | "confeccion"
  | "bobinado";

/**
 * Estados que necesita la representación visual de un paso de ruta.
 *
 * `finalizado` significa que terminó la ejecución y todavía puede requerir
 * control de calidad.
 *
 * `aprobado` significa que el control de calidad permitió continuar.
 *
 * `rechazado` significa que el control de calidad no fue aprobado.
 */
export type ProcesoMockEstado =
  | "pendiente"
  | "en_proceso"
  | "finalizado"
  | "aprobado"
  | "rechazado";

/**
 * ============================================================================
 * PRIORIDAD
 * ============================================================================
 */

export type Prioridad =
  | "baja"
  | "media"
  | "alta"
  | "urgente";

/**
 * ============================================================================
 * ESTADOS DE ORDEN
 * ============================================================================
 *
 * Estados utilizados por la pantalla de planificación.
 */

export type OrdenProduccionMockEstado =
  | "viable"
  | "en_planificacion"
  | "ruta_confirmada"
  | "materia_prima_lista"
  | "en_produccion"
  | "completado";

/**
 * ============================================================================
 * ESTADOS DEL KANBAN
 * ============================================================================
 */

export type ProduccionKanbanEstado =
  | "pendiente"
  | "en_proceso"
  | "completada"
  | "cancelada";

/**
 * ============================================================================
 * ESPECIFICACIONES DEL PRODUCTO
 * ============================================================================
 */

export interface ProductoEspecificacionesMock {
  tipoProducto: string;
  material: string;

  micraje: number;

  ancho: number;
  anchoDoblado: number;
  anchoDesdoblado: number;

  fuelle: number;

  color: string;

  numeroCapas: number;

  tipoImpresion: string;
  coloresImpresion: number;

  tipoSello: string;

  otras: string;
}

/**
 * ============================================================================
 * EQUIPOS / MÁQUINAS
 * ============================================================================
 */

export type EquipoMockEstado =
  | "disponible"
  | "ocupado"
  | "mantenimiento"
  | "fuera_servicio";

export interface EquipoMock {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  estado: EquipoMockEstado;
  capacidadActual: number;
}

/**
 * ============================================================================
 * PASO DE RUTA
 * ============================================================================
 */

export interface PasoRutaMock {
  id: string;

  proceso: TipoProceso;
  orden: number;

  estado: ProcesoMockEstado;

  maquinaId?: number;
  maquinaNombre?: string;

  operador?: string;

  horaInicio?: string;
  horaFin?: string;
  duracion?: string;

  cantidadProducida?: number;
  cantidadAceptada?: number;
  cantidadRechazada?: number;
  merma?: number;
}

/**
 * ============================================================================
 * RUTA DE PRODUCCIÓN
 * ============================================================================
 */

export interface RutaProduccionMock {
  propuesta: PasoRutaMock[];

  confirmada: PasoRutaMock[];

  confirmadaPor?: string;
  fechaConfirmacion?: string;
}

/**
 * ============================================================================
 * CONTROL DE CALIDAD
 * ============================================================================
 */

export type CalidadResultado =
  | "cumple"
  | "observado"
  | "no_cumple";

export interface ControlCalidadItemMock {
  id: string;

  caracteristica: string;
  requerido: string;
  medido: string;

  resultado: CalidadResultado;
}

export interface ControlCalidadMock {
  id: number;

  proceso: TipoProceso;

  aprobado: boolean;

  fecha: string;
  usuario: string;

  observaciones: string;

  items: ControlCalidadItemMock[];
}

/**
 * ============================================================================
 * HISTORIAL
 * ============================================================================
 */

export interface HistorialProduccionEventoMock {
  id: number;

  usuario: string;
  accion: string;

  observacion?: string;

  fecha: string;
}

/**
 * ============================================================================
 * MATERIA PRIMA
 * ============================================================================
 */

export interface MateriaPrimaMock {
  id: number | string;

  nombre: string;
  tipo: string;
  lote: string;

  cantidadPlanificada: number;

  unidad: string;

  cantidadDisponible: number;
  cantidadUtilizar: number;

  observaciones: string;
}

/**
 * ============================================================================
 * ORDEN DE PRODUCCIÓN
 * ============================================================================
 */

export interface OrdenProduccionMock {
  id: number;

  pedidoId: number;
  pedidoNumero: string;

  clienteNombre: string;
  productoNombre: string;

  cantidad: number;

  prioridad: Prioridad;

  fechaRequerida: string;

  estado: OrdenProduccionMockEstado;

  especificaciones: ProductoEspecificacionesMock;

  ruta: RutaProduccionMock;

  materiasPrimas: MateriaPrimaMock[];

  controlesCalidad: ControlCalidadMock[];

  historial: HistorialProduccionEventoMock[];
}

/**
 * ============================================================================
 * TARJETA DEL KANBAN
 * ============================================================================
 *
 * Representa exactamente los datos visuales que necesita una tarjeta
 * del tablero principal.
 */

export interface ProduccionKanbanItemMock {
  id: string;

  pedidoId: number;
  pedidoNumero: string;

  estado: ProduccionKanbanEstado;

  prioridad: Prioridad;

  maquinaNombre: string;
  operador: string;

  cantidad: number;
  producido: number;

  tiempoTranscurrido: string;
  tiempoEstimado: string;

  ruta: string[];
}

/**
 * ============================================================================
 * MODELO COMPLETO DEL MOCK
 * ============================================================================
 */

export interface ProduccionMockData {
  ordenes: OrdenProduccionMock[];

  operaciones: ProduccionKanbanItemMock[];

  equipos: EquipoMock[];

  materiasPrimasDisponibles: MateriaPrimaMock[];
}