import type { CrudListParams } from "../../api/api.types";

/**
 * ============================================================================
 * ESTADOS DE LA OPERACIÓN
 * ============================================================================
 *
 * Deben coincidir con ProduccionOperacion.Estado del backend.
 */
export type ProduccionOperacionEstado =
  | "pendiente"
  | "en_proceso"
  | "completada"
  | "cancelada";

/**
 * ============================================================================
 * ENTIDAD PRINCIPAL
 * ============================================================================
 *
 * Corresponde al serializer de ProduccionOperacion.
 *
 * Los campos representan relaciones mediante sus IDs, tal como los expone
 * actualmente el ModelSerializer del backend.
 */
export interface ProduccionOperacion {
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
}

/**
 * ============================================================================
 * CREATE
 * ============================================================================
 *
 * `id`, `created_at` y `updated_at` son generados por el backend.
 */
export interface CreateProduccionOperacionInput {
  orden_ruta: number;
  ruta_operacion: number;
  resultado_viabilidad: number;
  equipo: number;

  numero_operacion: number;

  fecha_inicio_planificada: string;
  fecha_inicio_real?: string | null;

  fecha_fin_planificada: string;
  fecha_fin_real?: string | null;

  estado?: ProduccionOperacionEstado;

  cantidad_producida?: string;

  observaciones?: string;
}

/**
 * ============================================================================
 * UPDATE
 * ============================================================================
 *
 * El backend utiliza PATCH/PUT mediante el CRUD genérico.
 */
export interface UpdateProduccionOperacionInput {
  orden_ruta?: number;
  ruta_operacion?: number;
  resultado_viabilidad?: number;
  equipo?: number;

  numero_operacion?: number;

  fecha_inicio_planificada?: string;
  fecha_inicio_real?: string | null;

  fecha_fin_planificada?: string;
  fecha_fin_real?: string | null;

  estado?: ProduccionOperacionEstado;

  cantidad_producida?: string;

  observaciones?: string;
}

/**
 * ============================================================================
 * PARÁMETROS DE LISTADO
 * ============================================================================
 *
 * Mantenemos el patrón utilizado por `users.types.ts`.
 *
 * Los parámetros concretos solamente tendrán efecto si el backend tiene
 * configurados filtros/paginación para esos campos.
 *
 * `CrudListParams` mantiene compatibilidad con cualquier parámetro adicional.
 */
export interface ProduccionOperacionListParams extends CrudListParams {
  estado?: ProduccionOperacionEstado;

  orden_ruta?: number;

  ruta_operacion?: number;

  resultado_viabilidad?: number;

  equipo?: number;

  numero_operacion?: number;

  page?: number;

  page_size?: number;

  ordering?: string;

  search?: string;
}

/**
 * ============================================================================
 * RESPUESTA PAGINADA
 * ============================================================================
 *
 * Compatible con el formato estándar de Django REST Framework.
 */
export interface ProduccionOperacionPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProduccionOperacion[];
}

/**
 * ============================================================================
 * RESPUESTA DE LISTADO
 * ============================================================================
 *
 * Dejamos soportadas las dos formas posibles:
 *
 * 1. API sin paginación:
 *    ProduccionOperacion[]
 *
 * 2. API con paginación:
 *    { count, next, previous, results }
 *
 * Cuando confirmemos la configuración REST_FRAMEWORK del backend podremos
 * reducir este contrato a una sola forma.
 */
export type ProduccionOperacionListResponse =
  | ProduccionOperacion[]
  | ProduccionOperacionPaginatedResponse;

/**
 * ============================================================================
 * ACCIONES DE NEGOCIO
 * ============================================================================
 *
 * Estas acciones NO forman parte del CRUD convencional.
 *
 * El backend actualmente dispone de:
 *
 * POST /producciones-operaciones/{id}/iniciar/
 * POST /producciones-operaciones/{id}/registrar-produccion/
 * POST /producciones-operaciones/{id}/registrar-merma/
 * POST /producciones-operaciones/{id}/finalizar/
 *
 * Los payloads de registrar-produccion y registrar-merma se mantienen
 * deliberadamente abiertos hasta trabajar con las firmas exactas de los
 * métodos del ViewSet.
 *
 * Así evitamos inventar campos que el backend no nos haya confirmado.
 */

/**
 * Payload genérico para una acción de negocio.
 */
export type ProduccionOperacionActionPayload =
  Record<string, unknown>;

/**
 * Payload para registrar producción.
 *
 * Se refinará cuando conectemos el body exacto del endpoint.
 */
export type RegistrarProduccionInput =
  ProduccionOperacionActionPayload;

/**
 * Payload para registrar merma.
 *
 * Se refinará cuando conectemos el body exacto del endpoint.
 */
export type RegistrarMermaInput =
  ProduccionOperacionActionPayload;