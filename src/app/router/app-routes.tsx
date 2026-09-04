import { lazy } from "react";
import { Navigate } from "react-router-dom";

import type { AppRoute } from "./route.types";

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
 *
 * Este archivo puede comenzar siendo pequeño y crecer mediante composición
 * de grupos de rutas cuando la aplicación aumente de tamaño.
 */
export const appRoutes: AppRoute[] = [
  /**
   * --------------------------------------------------------------------------
   * PUBLIC ROUTES
   * --------------------------------------------------------------------------
   */
  {
    path: "/",
    element: <HomePage />,
  },

  /**
   * --------------------------------------------------------------------------
   * APPLICATION LAYOUT
   * --------------------------------------------------------------------------
   *
   * Las rutas hijas comparten el mismo layout.
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
   * Los redirects forman parte de la configuración de la aplicación.
   *
   * El router genérico no necesita conocer ninguna lógica específica
   * de redirects.
   */
  {
    path: "/old-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },

  /**
   * --------------------------------------------------------------------------
   * FALLBACK
   * --------------------------------------------------------------------------
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
