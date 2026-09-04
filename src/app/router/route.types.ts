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
 * ===========================================================================
 * APP ROUTE
 * ===========================================================================
 *
 * Contrato genérico de una ruta de la aplicación.
 *
 * No contiene información específica de ningún backend,
 * módulo o dominio.
 */
export interface AppRoute {
  path?: string;

  index?: boolean;

  element?: ReactNode;

  children?: AppRoute[];

  meta?: RouteMeta;
}
