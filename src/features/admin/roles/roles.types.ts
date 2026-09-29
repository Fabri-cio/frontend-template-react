/**
 * ============================================================================
 * ROLES
 * ============================================================================
 *
 * Representa un rol de Django (Group).
 *
 * El backend actualmente expone únicamente:
 * - id
 * - name
 */
export interface Role {
  id: number;
  name: string;
}

/**
 * ============================================================================
 * LISTADO DE ROLES
 * ============================================================================
 *
 * El endpoint /api/roles/ utiliza la paginación ERP.
 */
export interface RoleListParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

/**
 * ============================================================================
 * CREATE
 * ============================================================================
 */
export interface CreateRoleInput {
  name: string;
}

/**
 * ============================================================================
 * UPDATE
 * ============================================================================
 */
export interface UpdateRoleInput {
  name?: string;
}

/**
 * ============================================================================
 * GESTIÓN DE ROLES DE UN USUARIO
 * ============================================================================
 *
 * Estos tipos corresponden a:
 *
 * GET
 * /api/usuarios/{user_id}/roles/
 *
 * POST / PUT / DELETE
 * /api/usuarios/{user_id}/roles/
 */

export interface ManageUserRolesInput {
  role_ids: number[];
}

export interface ManageUserRolesResponse {
  detail: string;
  user_id: number;
  roles: Role[];
}