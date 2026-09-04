import { lazy } from "react";

import type { AppRoute } from "./route.types";
import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../../pages/home/home-page"));

const NotFoundPage = lazy(() => import("../../pages/not-found/not-found-page"));

const AppLayout = lazy(() => import("../../pages/layouts/app-layout"));

const DashboardPage = lazy(
  () => import("../../pages/dashboard/dashboard-page"),
);

/**
 * ============================================================================
 * APPLICATION ROUTES
 * ============================================================================
 *
 * Configuración de rutas específica de la aplicación.
 *
 * El router genérico únicamente interpreta esta estructura.
 */
export const appRoutes: AppRoute[] = [
  /**
   * Ruta pública.
   */
  {
    path: "/",
    element: <HomePage />,
  },

  /**
   * Grupo de rutas que comparten un layout.
   */
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * REDIRECT
   * --------------------------------------------------------------------------
   *
   * Ejemplo de una redirección configurada por la aplicación.
   *
   * El router genérico no necesita conocer ninguna lógica especial
   * de redirects.
   */
  {
    path: "/old-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },

  /**
   * Fallback.
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
