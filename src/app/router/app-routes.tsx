import { Navigate } from "react-router-dom";

import type { AppRoute } from "./route.types";
import {
  AppLayout,
  DashboardPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  UiPlaygroundPage,
  UserCreatePage,
  UserEditPage,
  UsersPage,
} from "./route-components";

/**
 * ============================================================================
 * RUTAS DE LA APLICACIÓN
 * ============================================================================
 *
 * Configuración de rutas específica de la aplicación.
 *
 * El router genérico únicamente interpreta esta estructura.
 */
export const appRoutes: AppRoute[] = [
  /**
   * --------------------------------------------------------------------------
   * AUTENTICACIÓN
   * --------------------------------------------------------------------------
   */
  {
    path: "/login",
    element: <LoginPage />,
  },

  /**
   * --------------------------------------------------------------------------
   * LAYOUT PRINCIPAL
   * --------------------------------------------------------------------------
   *
   * Las rutas principales de la aplicación comparten:
   *
   * - Sidebar
   * - Header
   * - Área de contenido
   */
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/ui-playground",
        element: <UiPlaygroundPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/users/new",
        element: <UserCreatePage />,
      },
      {
        path: "/users/:id",
        element: <UserEditPage />,
      },
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * REDIRECCIÓN
   * --------------------------------------------------------------------------
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
