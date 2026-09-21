import { createCrudOperations } from "../../api/api-crud";
import { api } from "../../api/api.config";

import type {
  CreateProduccionOperacionInput,
  ProduccionOperacion,
  ProduccionOperacionActionPayload,
  ProduccionOperacionListParams,
  ProduccionOperacionListResponse,
  RegistrarMermaInput,
  RegistrarProduccionInput,
  UpdateProduccionOperacionInput,
} from "./produccion.types";

/**
 * ============================================================================
 * CRUD BASE
 * ============================================================================
 *
 * ProduccionOperacion sí dispone de un ModelViewSet, por lo que podemos
 * reutilizar nuestra abstracción CRUD genérica.
 */
const produccionOperacionesCrud =
  createCrudOperations<
    ProduccionOperacion,
    CreateProduccionOperacionInput,
    UpdateProduccionOperacionInput,
    ProduccionOperacionListResponse,
    ProduccionOperacionListParams
  >(
    api,
    "produccion/producciones-operaciones",
    {
      trailingSlash: true,
    },
  );

/**
 * ============================================================================
 * API DE PRODUCCIÓN
 * ============================================================================
 *
 * Combinamos:
 *
 * - CRUD convencional
 * - acciones específicas del dominio de Producción
 *
 * Esto evita modificar `api-crud.ts` para introducir conocimiento
 * específico de una feature.
 */
export const produccionApi = {
  /**
   * CRUD convencional.
   */
  ...produccionOperacionesCrud,

  /**
   * --------------------------------------------------------------------------
   * INICIAR OPERACIÓN
   * --------------------------------------------------------------------------
   *
   * POST /produccion/producciones-operaciones/{id}/iniciar/
   *
   * La lógica de validación pertenece al backend:
   *
   * - estado pendiente
   * - equipo operativo
   * - equipo no ocupado
   * - operación anterior completada
   * - calidad final aprobada
   */
  iniciar: (id: number) => {
    return api.post<ProduccionOperacion>(
      `/produccion/producciones-operaciones/${encodeURIComponent(String(id))}/iniciar/`,
    );
  },

  /**
   * --------------------------------------------------------------------------
   * REGISTRAR PRODUCCIÓN
   * --------------------------------------------------------------------------
   *
   * POST /produccion/producciones-operaciones/{id}/registrar-produccion/
   *
   * El body concreto depende de la implementación del ViewSet.
   */
  registrarProduccion: (
    id: number,
    data: RegistrarProduccionInput,
  ) => {
    return api.post<
      unknown,
      RegistrarProduccionInput
    >(
      `/produccion/producciones-operaciones/${encodeURIComponent(String(id))}/registrar-produccion/`,
      data,
    );
  },

  /**
   * --------------------------------------------------------------------------
   * REGISTRAR MERMA
   * --------------------------------------------------------------------------
   *
   * POST /produccion/producciones-operaciones/{id}/registrar-merma/
   *
   * El body concreto depende de la implementación actual del ViewSet.
   */
  registrarMerma: (
    id: number,
    data: RegistrarMermaInput,
  ) => {
    return api.post<
      unknown,
      RegistrarMermaInput
    >(
      `/produccion/producciones-operaciones/${encodeURIComponent(String(id))}/registrar-merma/`,
      data,
    );
  },

  /**
   * --------------------------------------------------------------------------
   * FINALIZAR OPERACIÓN
   * --------------------------------------------------------------------------
   *
   * POST /produccion/producciones-operaciones/{id}/finalizar/
   */
  finalizar: (id: number) => {
    return api.post<ProduccionOperacion>(
      `/produccion/producciones-operaciones/${encodeURIComponent(String(id))}/finalizar/`,
    );
  },
};

/**
 * ============================================================================
 * TIPO AUXILIAR
 * ============================================================================
 *
 * Se mantiene exportado por comodidad para usos avanzados.
 */
export type ProduccionApiActionPayload =
  ProduccionOperacionActionPayload;