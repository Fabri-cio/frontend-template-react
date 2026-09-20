import { useApiQuery } from "../../hooks/use.api.query";

import type { ProduccionOperacion } from "./produccion.types";

import { produccionApi } from "./produccion.api";

/**
 * Obtiene las operaciones de producción.
 */
export function useProduccionOperaciones() {
  return useApiQuery<ProduccionOperacion[]>({
    queryKey: ["produccion", "operaciones"],
    queryFn: () => produccionApi.list(),
  });
}
