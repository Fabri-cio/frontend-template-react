import { Route, Routes } from "react-router-dom";
import type { AppRoute } from "./route.types";
import { Suspense } from "react";
import { RouteGuard, type RouteAccessResult } from "./route-guard";

/**
 * ===========================================================================
 * ROUTE RENDERER
 * ===========================================================================
 *
 * Convierte nuestra definición genérica `AppRoute[]` en rutas
 * compatibles con React Router.
 *
 * Este componente no conoce ningún dominio de negocio.
 *
 * No sabe qué es:
 *
 * - usuarios
 * - productos
 * - inventario
 * - ventas
 * - ERP
 * - autenticación
 *
 * Únicamente interpreta la estructura de las rutas.
 */

interface RouteRendererProps {
  routes: AppRoute[];

  /**
   * Determina si una ruta protegida puede ser accedida.
   *
   * Es opcional porque no todas las aplicaciones necesitan
   * autenticación o autorización.
   */
  canAccess?: (route: AppRoute) => RouteAccessResult;
}

const renderRoute = (
  route: AppRoute,
  index: number,
  canAccess?: (route: AppRoute) => RouteAccessResult,
) => {
  const key = route.path ?? `index-${index}`;

  /**
   * -------------------------------------------------------------------------
   * INDEX ROUTE
   * -------------------------------------------------------------------------
   *
   * Las rutas índice tienen reglas especiales en React Router:
   *
   * - utilizan `index`
   * - no utilizan `path`
   * - no tienen rutas hijas
   */
  if (route.index) {
    const element = canAccess ? (
      <RouteGuard route={route} canAccess={canAccess}>
        {route.element}
      </RouteGuard>
    ) : (
      route.element
    );
    return <Route key={key} index element={element} />;
  }

  /**
   * -------------------------------------------------------------------------
   * NESTED ROUTE
   * -------------------------------------------------------------------------
   *
   * Una ruta puede actuar como padre de otras rutas.
   */
  if (route.children && route.children.length > 0) {
    return (
      <Route
        key={key}
        path={route.path}
        element={
          canAccess ? (
            <RouteGuard route={route} canAccess={canAccess}>
              {route.element}
            </RouteGuard>
          ) : (
            route.element
          )
        }
      >
        {route.children.map((childRoute, childIndex) =>
          renderRoute(childRoute, childIndex, canAccess),
        )}
      </Route>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * NORMAL ROUTE
   * -------------------------------------------------------------------------
   */
  const element = canAccess ? (
    <RouteGuard route={route} canAccess={canAccess}>
      {route.element}
    </RouteGuard>
  ) : (
    route.element
  );

  return <Route key={key} path={route.path} element={element} />;
};

export const RouteRenderer = ({ routes, canAccess }: RouteRendererProps) => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {routes.map((route, index) => renderRoute(route, index, canAccess))}
      </Routes>
    </Suspense>
  );
};
