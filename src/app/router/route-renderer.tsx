import { Route, Routes } from "react-router-dom";
import type { AppRoute } from "./route.types";

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
}

const renderRoute = (route: AppRoute, index: number) => {
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
    return <Route key={key} index element={route.element} />;
  }

  /**
   * -------------------------------------------------------------------------
   * NESTED ROUTE
   * -------------------------------------------------------------------------
   *
   * Una ruta puede actuar como padre de otras rutas.
   */
  if (route.children) {
    return (
      <Route key={key} path={route.path} element={route.element}>
        {route.children.map((childRoute, childIndex) =>
          renderRoute(childRoute, childIndex),
        )}
      </Route>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * NORMAL ROUTE
   * -------------------------------------------------------------------------
   */
  return <Route key={key} path={route.path} element={route.element} />;
};

export const RouteRenderer = ({ routes }: RouteRendererProps) => {
  return <Routes>{routes.map(renderRoute)}</Routes>;
};
