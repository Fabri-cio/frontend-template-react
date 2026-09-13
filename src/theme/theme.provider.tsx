/**
 * ============================================================================
 * THEME PROVIDER
 * ============================================================================
 *
 * Provider global del sistema de temas.
 *
 * Responsabilidades:
 *
 * - Mantener el modo light/dark/system.
 * - Resolver "system" a light o dark.
 * - Mantener el color de identidad.
 * - Persistir las preferencias.
 * - Escuchar cambios del tema del sistema.
 * - Aplicar la configuración sobre <html>.
 *
 * La lógica de almacenamiento, resolución y aplicación visual vive en
 * theme.engine.ts para mantener separadas las responsabilidades.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ThemeContext } from "./theme.context";

import {
  applyColorTheme,
  applyResolvedTheme,
  applyTheme,
  getStoredColorTheme,
  getStoredTheme,
  resolveTheme,
  storeColorTheme,
  storeTheme,
} from "./theme.engine";

import type { ColorTheme, ResolvedTheme, Theme } from "./theme.types";

/**
 * ----------------------------------------------------------------------------
 * Props
 * ----------------------------------------------------------------------------
 */

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ----------------------------------------------------------------------------
 * Provider
 * ----------------------------------------------------------------------------
 */

export function ThemeProvider({ children }: ThemeProviderProps) {
  /**
   * Preferencia de apariencia seleccionada por el usuario.
   */
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  /**
   * Color de identidad seleccionado por el usuario.
   */
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() =>
    getStoredColorTheme(),
  );

  /**
   * Tema efectivo del sistema cuando la preferencia seleccionada
   * es "system".
   *
   * Nunca será "system".
   */
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    resolveTheme("system"),
  );

  /**
   * Tema efectivo actualmente utilizado por la aplicación.
   *
   * Si el usuario seleccionó "system", utilizamos el tema detectado
   * del sistema operativo. En los demás casos utilizamos directamente
   * la preferencia seleccionada.
   */
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  /**
   * --------------------------------------------------------------------------
   * Aplicación visual
   * --------------------------------------------------------------------------
   */

  useLayoutEffect(() => {
    applyTheme(theme);
    applyColorTheme(colorTheme);
  }, [theme, colorTheme]);

  /**
   * --------------------------------------------------------------------------
   * Theme setter
   * --------------------------------------------------------------------------
   */

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    storeTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  /**
   * --------------------------------------------------------------------------
   * Color theme setter
   * --------------------------------------------------------------------------
   */

  const setColorTheme = useCallback((nextColorTheme: ColorTheme) => {
    setColorThemeState(nextColorTheme);
    storeColorTheme(nextColorTheme);
    applyColorTheme(nextColorTheme);
  }, []);

  /**
   * --------------------------------------------------------------------------
   * System theme listener
   * --------------------------------------------------------------------------
   *
   * Cuando el usuario selecciona "system", reaccionamos a cambios
   * en la preferencia del sistema operativo.
   */

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      const nextResolvedTheme: ResolvedTheme = event.matches ? "dark" : "light";

      setSystemTheme(nextResolvedTheme);

      /**
       * Aquí usamos applyResolvedTheme porque ya tenemos
       * "light" o "dark". No debemos volver a resolverlo.
       */
      applyResolvedTheme(nextResolvedTheme);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  /**
   * --------------------------------------------------------------------------
   * Context value
   * --------------------------------------------------------------------------
   */

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      colorTheme,
      setTheme,
      setColorTheme,
    }),
    [theme, resolvedTheme, colorTheme, setTheme, setColorTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
