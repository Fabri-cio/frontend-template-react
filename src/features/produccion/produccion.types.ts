/**
 * Estados posibles de una operación de producción.
 *
 * Corresponden directamente a ProduccionOperacion.Estado
 * en el backend.
 */
export type ProduccionOperacionEstado =
  | "pendiente"
  | "en_proceso"
  | "completada"
  | "cancelada";

/**
 * Representa una operación de producción tal como
 * la devuelve actualmente el serializer de Django REST Framework.
 *
 * Importante:
 * Los DecimalField del backend se reciben normalmente
 * como strings en JSON. Por eso `cantidad_producida`
 * se representa como string y no como number.
 */
export interface ProduccionOperacion {
  /** Identificador de la operación. */
  id: number;

  /** ID de la OrdenRuta asociada. */
  orden_ruta: number;

  /** ID de la operación definida en la ruta. */
  ruta_operacion: number;

  /** ID del resultado de viabilidad asociado. */
  resultado_viabilidad: number;

  /** ID del equipo asignado. */
  equipo: number;

  /** Número secuencial de la operación dentro de la ruta. */
  numero_operacion: number;

  /** Fecha planificada de inicio en formato ISO. */
  fecha_inicio_planificada: string;

  /** Fecha real de inicio. Puede ser null si todavía no comenzó. */
  fecha_inicio_real: string | null;

  /** Fecha planificada de finalización en formato ISO. */
  fecha_fin_planificada: string;

  /** Fecha real de finalización. Puede ser null si todavía no terminó. */
  fecha_fin_real: string | null;

  /** Estado actual de la operación. */
  estado: ProduccionOperacionEstado;

  /** Cantidad acumulada producida. */
  cantidad_producida: string;

  /** Observaciones de la operación. */
  observaciones: string;

  /** Fecha de creación del registro en formato ISO. */
  created_at: string;

  /** Fecha de última actualización en formato ISO. */
  updated_at: string;
}
