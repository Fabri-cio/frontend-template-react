import { Outlet } from "react-router-dom";

/**
 * Layout de ejemplo.
 *
 * Demuestra cómo una aplicación puede compartir una estructura
 * entre múltiples rutas.
 *
 * No contiene decisiones de dominio.
 */
const AppLayout = () => {
  return (
    <div>
      <header>
        <strong>Application</strong>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
