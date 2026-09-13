import { useSearchParams } from "react-router-dom";

/**
 * Permite leer y modificar los parámetros de consulta de la URL.
 *
 * Este hook no conoce el significado de ningún parámetro.
 * La feature consumidora decide qué parámetros utilizar.
 */
export function useUrlQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Obtiene el valor de un parámetro.
   */
  function get(name: string): string | null {
    return searchParams.get(name);
  }

  /**
   * Obtiene todos los valores asociados a un parámetro.
   */
  function getAll(name: string): string[] {
    return searchParams.getAll(name);
  }

  /**
   * Actualiza un parámetro manteniendo los demás.
   */
  function set(name: string, value: string): void {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }

    setSearchParams(nextParams);
  }

  /**
   * Elimina un parámetro manteniendo los demás.
   */
  function remove(name: string): void {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete(name);

    setSearchParams(nextParams);
  }

  /**
   * Reemplaza los parámetros indicados manteniendo los demás.
   */
  function setMany(values: Record<string, string | null | undefined>): void {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([name, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(name);
      } else {
        nextParams.set(name, value);
      }
    });

    setSearchParams(nextParams);
  }

  return {
    searchParams,
    get,
    getAll,
    set,
    remove,
    setMany,
  };
}