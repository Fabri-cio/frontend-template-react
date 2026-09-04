import type { ReactNode } from "react";

/**
 * ===========================================================================
 * ROUTE META
 * ===========================================================================
 *
 * Información opcional asociada a una ruta.
 *
 * El router no interpreta estas propiedades por sí mismo.
 * Las aplicaciones pueden utilizarlas para implementar títulos,
 * autenticación, permisos, navegación, breadcrumbs, analytics, etc.
 */
export interface RouteMeta {
  title?: string;

  requiresAuth?: boolean;

  permissions?: string[];

  roles?: string[];

  [key: string]: unknown;
}

/**
 * ============================================================================
 * APPLICATION ROUTE
 * ============================================================================
 *
 * Representa una ruta independiente de la implementación concreta
 * del dominio de la aplicación.
 *
 * Permite construir árboles de rutas mediante `children`.
 */
export interface AppRoute {
  /**
   * Ruta.
   *
   * Ejemplos:
   *
   * "/"
   * "/users"
   * "users"
   * ":id"
   * "*"
   */
  path?: string;

  /**
   * Componente que representa la ruta.
   */
  element?: ReactNode;

  /**
   * Indica una ruta índice dentro de una ruta padre.
   */
  index?: boolean;

  /**
   * Rutas hijas.
   *
   * Permite construir estructuras anidadas.
   */
  children?: AppRoute[];

  meta?: RouteMeta;
}
