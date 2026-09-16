import { lazy } from "react";

/**
 * ============================================================================
 * COMPONENTES DE RUTA
 * ============================================================================
 *
 * Este archivo contiene únicamente componentes React utilizados por
 * la configuración de rutas.
 *
 * Mantener estos componentes separados de `appRoutes` permite que
 * React Fast Refresh pueda identificar correctamente los componentes
 * y evita mezclar componentes con configuración de aplicación.
 */

export const UiPlaygroundPage = lazy(
  () => import("../../pages/ui-playground/ui-playground-page"),
);

export const HomePage = lazy(() => import("../../pages/home/home-page"));

export const NotFoundPage = lazy(
  () => import("../../pages/not-found/not-found-page"),
);

export const AppLayout = lazy(() => import("../../pages/layouts/app-layout"));

export const DashboardPage = lazy(
  () => import("../../pages/dashboard/dashboard-page"),
);

export const UsersPage = lazy(
  () => import("../../features/usuarios/UsersPage"),
);

export const UserCreatePage = lazy(
  () => import("../../features/usuarios/UserCreatePage"),
);

export const UserEditPage = lazy(
  () => import("../../features/usuarios/UserEditPage"),
);

export const LoginPage = lazy(() => import("../../features/auth/LoginPage"));

