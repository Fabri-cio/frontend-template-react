import type {
  EquipoMock,
  MateriaPrimaMock,
  OrdenProduccionMock,
  ProduccionKanbanItemMock,
  ProduccionMockData,
  PasoRutaMock,
} from "./produccion.page.types";

/**
 * ============================================================================
 * DATOS MOCK DE PRODUCCIÓN
 * ============================================================================
 *
 * Este archivo contiene datos de demostración para construir y validar
 * la interfaz de Producción antes de conectar el backend real.
 *
 * IMPORTANTE:
 *
 * Estos datos NO forman parte del contrato de API.
 *
 * Su objetivo es permitirnos desarrollar:
 *
 * - ProduccionPage
 * - ProduccionOrdenDetallePage
 * - ProduccionPlanificacionPage
 *
 * con toda su interacción visual y funcional.
 *
 * Posteriormente podremos sustituir este mock por un adaptador que transforme
 * las respuestas reales del backend al modelo de `produccion.page.types.ts`.
 */

/**
 * ============================================================================
 * HELPERS INTERNOS
 * ============================================================================
 */

function paso(
  values: Omit<PasoRutaMock, "id"> & { id: string },
): PasoRutaMock {
  return values;
}

/**
 * ============================================================================
 * EQUIPOS
 * ============================================================================
 */

export const EQUIPOS_MOCK: EquipoMock[] = [
  {
    id: 1,
    codigo: "EXT-001",
    nombre: "Extrusora Principal",
    tipo: "Extrusora",
    marca: "W&H",
    modelo: "Varex II",
    estado: "ocupado",
    capacidadActual: 82,
  },
  {
    id: 2,
    codigo: "EXT-002",
    nombre: "Extrusora Secundaria",
    tipo: "Extrusora",
    marca: "Bandera",
    modelo: "EVO",
    estado: "disponible",
    capacidadActual: 34,
  },
  {
    id: 3,
    codigo: "FLEX-001",
    nombre: "Flexográfica 8 colores",
    tipo: "Flexográfica",
    marca: "Windmöller",
    modelo: "HD",
    estado: "ocupado",
    capacidadActual: 67,
  },
  {
    id: 4,
    codigo: "CONF-001",
    nombre: "Confeccionadora Línea 1",
    tipo: "Confeccionadora",
    marca: "Totani",
    modelo: "BH",
    estado: "disponible",
    capacidadActual: 28,
  },
  {
    id: 5,
    codigo: "BOB-001",
    nombre: "Bobinadora Principal",
    tipo: "Bobinadora",
    marca: "Atlas",
    modelo: "Titan",
    estado: "mantenimiento",
    capacidadActual: 0,
  },
];

/**
 * ============================================================================
 * MATERIAS PRIMAS DISPONIBLES
 * ============================================================================
 */

export const MATERIAS_PRIMAS_DISPONIBLES_MOCK: MateriaPrimaMock[] = [
  {
    id: 101,
    nombre: "PEBD Transparente",
    tipo: "Polietileno de baja densidad",
    lote: "PE-2026-018",
    cantidadPlanificada: 0,
    unidad: "kg",
    cantidadDisponible: 850,
    cantidadUtilizar: 0,
    observaciones: "",
  },
  {
    id: 102,
    nombre: "PEBD Blanco",
    tipo: "Polietileno de baja densidad",
    lote: "PE-2026-021",
    cantidadPlanificada: 0,
    unidad: "kg",
    cantidadDisponible: 620,
    cantidadUtilizar: 0,
    observaciones: "",
  },
  {
    id: 103,
    nombre: "Masterbatch Azul",
    tipo: "Aditivo / pigmento",
    lote: "MB-AZ-2026-07",
    cantidadPlanificada: 0,
    unidad: "kg",
    cantidadDisponible: 145,
    cantidadUtilizar: 0,
    observaciones: "",
  },
  {
    id: 104,
    nombre: "Masterbatch Verde",
    tipo: "Aditivo / pigmento",
    lote: "MB-VR-2026-04",
    cantidadPlanificada: 0,
    unidad: "kg",
    cantidadDisponible: 120,
    cantidadUtilizar: 0,
    observaciones: "",
  },
];

/**
 * ============================================================================
 * ORDEN 1 - EN PRODUCCIÓN
 * ============================================================================
 */

const ORDEN_1_RUTA: PasoRutaMock[] = [
  paso({
    id: "op-001-1",
    proceso: "extrusion",
    orden: 1,
    estado: "aprobado",
    maquinaId: 1,
    maquinaNombre: "EXT-001",
    operador: "Carlos Mendoza",
    horaInicio: "2026-09-28T07:10:00-04:00",
    horaFin: "2026-09-28T11:45:00-04:00",
    duracion: "4h 35m",
    cantidadProducida: 10000,
    cantidadAceptada: 9800,
    cantidadRechazada: 100,
    merma: 100,
  }),

  paso({
    id: "op-001-2",
    proceso: "flexografia",
    orden: 2,
    estado: "en_proceso",
    maquinaId: 3,
    maquinaNombre: "FLEX-001",
    operador: "María Fernández",
    horaInicio: "2026-09-28T12:20:00-04:00",
    cantidadProducida: 6200,
    cantidadAceptada: 6000,
    cantidadRechazada: 100,
    merma: 100,
  }),

  paso({
    id: "op-001-3",
    proceso: "confeccion",
    orden: 3,
    estado: "pendiente",
    maquinaId: 4,
    maquinaNombre: "CONF-001",
  }),
];

export const ORDEN_PRODUCCION_1: OrdenProduccionMock = {
  id: 1,

  pedidoId: 101,
  pedidoNumero: "PED-2026-041",

  clienteNombre: "Alimentos del Pacífico",
  productoNombre: "Bolsa PE impresa 50 × 70 cm",

  cantidad: 10000,

  prioridad: "alta",

  fechaRequerida: "2026-09-30",

  estado: "en_produccion",

  especificaciones: {
    tipoProducto: "Bolsa plástica",
    material: "PEBD",
    micraje: 80,
    ancho: 50,
    anchoDoblado: 25,
    anchoDesdoblado: 50,
    fuelle: 10,
    color: "Transparente",
    numeroCapas: 3,
    tipoImpresion: "Flexografía",
    coloresImpresion: 4,
    tipoSello: "Sello lateral",
    otras: "Logo corporativo frontal",
  },

  ruta: {
    propuesta: ORDEN_1_RUTA,
    confirmada: ORDEN_1_RUTA,
    confirmadaPor: "Luis Rojas",
    fechaConfirmacion: "2026-09-27T16:20:00-04:00",
  },

  materiasPrimas: [
    {
      id: 101,
      nombre: "PEBD Transparente",
      tipo: "Polietileno de baja densidad",
      lote: "PE-2026-018",
      cantidadPlanificada: 520,
      unidad: "kg",
      cantidadDisponible: 850,
      cantidadUtilizar: 520,
      observaciones: "",
    },
    {
      id: 103,
      nombre: "Masterbatch Azul",
      tipo: "Aditivo / pigmento",
      lote: "MB-AZ-2026-07",
      cantidadPlanificada: 18,
      unidad: "kg",
      cantidadDisponible: 145,
      cantidadUtilizar: 18,
      observaciones: "",
    },
  ],

  controlesCalidad: [
    {
      id: 501,
      proceso: "extrusion",
      aprobado: true,
      fecha: "2026-09-28T12:00:00-04:00",
      usuario: "Ana Torres",
      observaciones: "Extrusión dentro de especificación.",
      items: [
        {
          id: "cc-501-1",
          caracteristica: "Material",
          requerido: "PEBD",
          medido: "PEBD",
          resultado: "cumple",
        },
        {
          id: "cc-501-2",
          caracteristica: "Color",
          requerido: "Transparente",
          medido: "Transparente",
          resultado: "cumple",
        },
        {
          id: "cc-501-3",
          caracteristica: "Micraje",
          requerido: "80 µm",
          medido: "81 µm",
          resultado: "cumple",
        },
        {
          id: "cc-501-4",
          caracteristica: "Ancho",
          requerido: "50 cm",
          medido: "50.1 cm",
          resultado: "observado",
        },
        {
          id: "cc-501-5",
          caracteristica: "Fuelle",
          requerido: "10 cm",
          medido: "10 cm",
          resultado: "cumple",
        },
      ],
    },
  ],

  historial: [
    {
      id: 1,
      usuario: "Luis Rojas",
      accion: "Ruta confirmada",
      observacion: "Ruta aprobada para producción.",
      fecha: "2026-09-27T16:20:00-04:00",
    },
    {
      id: 2,
      usuario: "Carlos Mendoza",
      accion: "Extrusión iniciada",
      fecha: "2026-09-28T07:10:00-04:00",
    },
    {
      id: 3,
      usuario: "Ana Torres",
      accion: "Control de calidad aprobado",
      observacion: "Proceso de extrusión aprobado.",
      fecha: "2026-09-28T12:00:00-04:00",
    },
    {
      id: 4,
      usuario: "María Fernández",
      accion: "Flexografía iniciada",
      fecha: "2026-09-28T12:20:00-04:00",
    },
  ],
};

/**
 * ============================================================================
 * ORDEN 2 - VIABLE / PENDIENTE DE PLANIFICACIÓN
 * ============================================================================
 */

const ORDEN_2_PROPUESTA: PasoRutaMock[] = [
  paso({
    id: "op-002-1",
    proceso: "extrusion",
    orden: 1,
    estado: "pendiente",
  }),
  paso({
    id: "op-002-2",
    proceso: "flexografia",
    orden: 2,
    estado: "pendiente",
  }),
  paso({
    id: "op-002-3",
    proceso: "bobinado",
    orden: 3,
    estado: "pendiente",
  }),
];

export const ORDEN_PRODUCCION_2: OrdenProduccionMock = {
  id: 2,

  pedidoId: 102,
  pedidoNumero: "PED-2026-042",

  clienteNombre: "Distribuciones Andinas",
  productoNombre: "Film industrial azul 60 cm",

  cantidad: 18000,

  prioridad: "urgente",

  fechaRequerida: "2026-10-02",

  estado: "viable",

  especificaciones: {
    tipoProducto: "Film industrial",
    material: "PEBD",
    micraje: 60,
    ancho: 60,
    anchoDoblado: 30,
    anchoDesdoblado: 60,
    fuelle: 0,
    color: "Azul",
    numeroCapas: 3,
    tipoImpresion: "Sin impresión",
    coloresImpresion: 0,
    tipoSello: "Bobinado",
    otras: "Alta resistencia",
  },

  ruta: {
    propuesta: ORDEN_2_PROPUESTA,
    confirmada: [],
  },

  materiasPrimas: [],

  controlesCalidad: [],

  historial: [
    {
      id: 10,
      usuario: "Sistema",
      accion: "Viabilidad aprobada",
      observacion: "La orden está lista para planificación.",
      fecha: "2026-09-28T09:15:00-04:00",
    },
  ],
};

/**
 * ============================================================================
 * ORDEN 3 - MATERIA PRIMA LISTA
 * ============================================================================
 */

const ORDEN_3_RUTA: PasoRutaMock[] = [
  paso({
    id: "op-003-1",
    proceso: "extrusion",
    orden: 1,
    estado: "pendiente",
    maquinaId: 2,
    maquinaNombre: "EXT-002",
  }),
  paso({
    id: "op-003-2",
    proceso: "confeccion",
    orden: 2,
    estado: "pendiente",
    maquinaId: 4,
    maquinaNombre: "CONF-001",
  }),
];

export const ORDEN_PRODUCCION_3: OrdenProduccionMock = {
  id: 3,

  pedidoId: 103,
  pedidoNumero: "PED-2026-043",

  clienteNombre: "Comercial del Sur",
  productoNombre: "Bolsa blanca 40 × 60 cm",

  cantidad: 7500,

  prioridad: "media",

  fechaRequerida: "2026-10-04",

  estado: "materia_prima_lista",

  especificaciones: {
    tipoProducto: "Bolsa",
    material: "PEBD",
    micraje: 70,
    ancho: 40,
    anchoDoblado: 20,
    anchoDesdoblado: 40,
    fuelle: 8,
    color: "Blanco",
    numeroCapas: 2,
    tipoImpresion: "Sin impresión",
    coloresImpresion: 0,
    tipoSello: "Sello lateral",
    otras: "",
  },

  ruta: {
    propuesta: ORDEN_3_RUTA,
    confirmada: ORDEN_3_RUTA,
    confirmadaPor: "Luis Rojas",
    fechaConfirmacion: "2026-09-28T13:40:00-04:00",
  },

  materiasPrimas: [
    {
      id: 104,
      nombre: "PEBD Blanco",
      tipo: "Polietileno de baja densidad",
      lote: "PE-2026-021",
      cantidadPlanificada: 390,
      unidad: "kg",
      cantidadDisponible: 620,
      cantidadUtilizar: 390,
      observaciones: "",
    },
  ],

  controlesCalidad: [],

  historial: [
    {
      id: 20,
      usuario: "Luis Rojas",
      accion: "Ruta confirmada",
      fecha: "2026-09-28T13:40:00-04:00",
    },
    {
      id: 21,
      usuario: "Almacén",
      accion: "Materia prima registrada",
      observacion: "Material disponible para iniciar producción.",
      fecha: "2026-09-28T14:10:00-04:00",
    },
  ],
};

/**
 * ============================================================================
 * ORDEN 4 - COMPLETADA
 * ============================================================================
 */

const ORDEN_4_RUTA: PasoRutaMock[] = [
  paso({
    id: "op-004-1",
    proceso: "extrusion",
    orden: 1,
    estado: "aprobado",
    maquinaId: 1,
    maquinaNombre: "EXT-001",
    operador: "Carlos Mendoza",
    horaInicio: "2026-09-25T07:00:00-04:00",
    horaFin: "2026-09-25T10:20:00-04:00",
    duracion: "3h 20m",
    cantidadProducida: 12000,
    cantidadAceptada: 11900,
    cantidadRechazada: 50,
    merma: 50,
  }),
  paso({
    id: "op-004-2",
    proceso: "confeccion",
    orden: 2,
    estado: "aprobado",
    maquinaId: 4,
    maquinaNombre: "CONF-001",
    operador: "Jorge Salazar",
    horaInicio: "2026-09-25T11:00:00-04:00",
    horaFin: "2026-09-25T15:30:00-04:00",
    duracion: "4h 30m",
    cantidadProducida: 12000,
    cantidadAceptada: 11900,
    cantidadRechazada: 50,
    merma: 50,
  }),
];

export const ORDEN_PRODUCCION_4: OrdenProduccionMock = {
  id: 4,

  pedidoId: 104,
  pedidoNumero: "PED-2026-038",

  clienteNombre: "Industrias Altiplano",
  productoNombre: "Bolsa blanca reforzada 45 × 65 cm",

  cantidad: 12000,

  prioridad: "baja",

  fechaRequerida: "2026-09-27",

  estado: "completado",

  especificaciones: {
    tipoProducto: "Bolsa reforzada",
    material: "PEBD",
    micraje: 90,
    ancho: 45,
    anchoDoblado: 22.5,
    anchoDesdoblado: 45,
    fuelle: 12,
    color: "Blanco",
    numeroCapas: 3,
    tipoImpresion: "Sin impresión",
    coloresImpresion: 0,
    tipoSello: "Sello lateral reforzado",
    otras: "",
  },

  ruta: {
    propuesta: ORDEN_4_RUTA,
    confirmada: ORDEN_4_RUTA,
    confirmadaPor: "Luis Rojas",
    fechaConfirmacion: "2026-09-24T15:00:00-04:00",
  },

  materiasPrimas: [
    {
      id: 105,
      nombre: "PEBD Blanco",
      tipo: "Polietileno de baja densidad",
      lote: "PE-2026-015",
      cantidadPlanificada: 610,
      unidad: "kg",
      cantidadDisponible: 0,
      cantidadUtilizar: 610,
      observaciones: "",
    },
  ],

  controlesCalidad: [
    {
      id: 504,
      proceso: "confeccion",
      aprobado: true,
      fecha: "2026-09-25T16:00:00-04:00",
      usuario: "Ana Torres",
      observaciones: "Producto final aprobado.",
      items: [
        {
          id: "cc-504-1",
          caracteristica: "Ancho",
          requerido: "45 cm",
          medido: "45 cm",
          resultado: "cumple",
        },
        {
          id: "cc-504-2",
          caracteristica: "Fuelle",
          requerido: "12 cm",
          medido: "12 cm",
          resultado: "cumple",
        },
        {
          id: "cc-504-3",
          caracteristica: "Sello",
          requerido: "Correcto",
          medido: "Correcto",
          resultado: "cumple",
        },
        {
          id: "cc-504-4",
          caracteristica: "Corte",
          requerido: "Correcto",
          medido: "Correcto",
          resultado: "cumple",
        },
      ],
    },
  ],

  historial: [
    {
      id: 30,
      usuario: "Luis Rojas",
      accion: "Ruta confirmada",
      fecha: "2026-09-24T15:00:00-04:00",
    },
    {
      id: 31,
      usuario: "Carlos Mendoza",
      accion: "Extrusión finalizada",
      fecha: "2026-09-25T10:20:00-04:00",
    },
    {
      id: 32,
      usuario: "Ana Torres",
      accion: "Control de calidad aprobado",
      fecha: "2026-09-25T11:00:00-04:00",
    },
    {
      id: 33,
      usuario: "Jorge Salazar",
      accion: "Confección finalizada",
      fecha: "2026-09-25T15:30:00-04:00",
    },
    {
      id: 34,
      usuario: "Ana Torres",
      accion: "Producto terminado aprobado",
      fecha: "2026-09-25T16:00:00-04:00",
    },
  ],
};

/**
 * ============================================================================
 * OPERACIONES PARA EL KANBAN
 * ============================================================================
 *
 * Estas tarjetas están preparadas específicamente para reproducir
 * la apariencia del tablero de la pantalla de Producción.
 */

export const PRODUCCION_OPERACIONES_MOCK: ProduccionKanbanItemMock[] = [
  {
    id: "kanban-001",
    pedidoId: 101,
    pedidoNumero: "PED-2026-041",
    estado: "en_proceso",
    prioridad: "alta",
    maquinaNombre: "FLEX-001",
    operador: "María Fernández",
    cantidad: 10000,
    producido: 6200,
    tiempoTranscurrido: "3h 10m",
    tiempoEstimado: "5h 30m",
    ruta: ["Extrusión", "Flexografía", "Confección"],
  },

  {
    id: "kanban-002",
    pedidoId: 103,
    pedidoNumero: "PED-2026-043",
    estado: "pendiente",
    prioridad: "media",
    maquinaNombre: "EXT-002",
    operador: "Por asignar",
    cantidad: 7500,
    producido: 0,
    tiempoTranscurrido: "0h",
    tiempoEstimado: "6h 00m",
    ruta: ["Extrusión", "Confección"],
  },

  {
    id: "kanban-003",
    pedidoId: 104,
    pedidoNumero: "PED-2026-038",
    estado: "completada",
    prioridad: "baja",
    maquinaNombre: "CONF-001",
    operador: "Jorge Salazar",
    cantidad: 12000,
    producido: 12000,
    tiempoTranscurrido: "7h 50m",
    tiempoEstimado: "8h 00m",
    ruta: ["Extrusión", "Confección"],
  },

  {
    id: "kanban-004",
    pedidoId: 105,
    pedidoNumero: "PED-2026-037",
    estado: "cancelada",
    prioridad: "baja",
    maquinaNombre: "EXT-001",
    operador: "Carlos Mendoza",
    cantidad: 5000,
    producido: 1200,
    tiempoTranscurrido: "1h 15m",
    tiempoEstimado: "4h 00m",
    ruta: ["Extrusión", "Bobinado"],
  },
];

/**
 * ============================================================================
 * DATOS COMPLETOS
 * ============================================================================
 */

export const PRODUCCION_MOCK: ProduccionMockData = {
  ordenes: [
    ORDEN_PRODUCCION_1,
    ORDEN_PRODUCCION_2,
    ORDEN_PRODUCCION_3,
    ORDEN_PRODUCCION_4,
  ],

  operaciones: PRODUCCION_OPERACIONES_MOCK,

  equipos: EQUIPOS_MOCK,

  materiasPrimasDisponibles: MATERIAS_PRIMAS_DISPONIBLES_MOCK,
};

/**
 * ============================================================================
 * FACTORY DE MOCK
 * ============================================================================
 *
 * Devuelve una copia independiente de los datos.
 *
 * Esto es importante porque las pantallas de planificación modificarán
 * temporalmente la ruta y las materias primas durante la interacción.
 *
 * Así evitamos modificar accidentalmente `PRODUCCION_MOCK` global.
 */

export function createProduccionMockData(): ProduccionMockData {
  return structuredClone(PRODUCCION_MOCK);
}