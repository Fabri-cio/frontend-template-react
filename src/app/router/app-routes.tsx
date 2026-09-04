import type { AppRoute } from "./route.types";
import HomePage from "../../pages/home/home-page";
import NotFoundPage from "../../pages/not-found/not-found-page";

/**
 * ===========================================================================
 * APPLICATION ROUTES
 * ===========================================================================
 *
 * Punto de entrada para las rutas de la aplicación.
 *
 * Este archivo pertenece a la aplicación, no al core del router.
 *
 * Aquí se registrarán posteriormente los grupos de rutas que necesite
 * cada proyecto.
 *
 * El router genérico no conoce estos módulos.
 */

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <HomePage />,
  },

  /**
   * -------------------------------------------------------------------------
   * NOT FOUND
   * -------------------------------------------------------------------------
   *
   * La ruta `*` funciona como fallback para cualquier URL que no
   * coincida con las rutas anteriores.
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
