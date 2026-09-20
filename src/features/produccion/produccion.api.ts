import { createCrudOperations } from "../../api/api-crud";
import { api } from "../../api/api.config";

import type { ProduccionOperacion } from "./produccion.types";

export const produccionApi = createCrudOperations<
  ProduccionOperacion
>(
  api,
  "produccion/producciones-operaciones",
  {
    trailingSlash: true,
  },
);