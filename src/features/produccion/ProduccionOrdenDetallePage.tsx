import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Factory,
  History as HistoryIcon,
  Layers,
  Package,
  Play,
  Printer,
  Scissors,
  User,
  Waves,
  XCircle,
  Square,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  EmptyState,
  Input,
  Label,
  LoadingState,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PageHeader,
  Tabs,
  Textarea,
} from "../../components/ui";

import { cn } from "../../lib/cn";

import {
  CALIDAD_RESULTADO_COLORS,
  CALIDAD_RESULTADO_LABELS,
  PROCESO_ESTADO_COLORS,
  PROCESO_ESTADO_LABELS,
  PROCESO_ICONS,
  PROCESO_LABELS,
} from "./produccion.constants";

import { createProduccionMockData } from "./produccion.mock";

import type {
  CalidadResultado,
  ControlCalidadItemMock,
  OrdenProduccionMock,
  TipoProceso,
} from "./produccion.page.types";

/**
 * ============================================================================
 * FORMATTERS
 * ============================================================================
 */

const numberFormatter = new Intl.NumberFormat("es-BO");

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ============================================================================
 * ICONOS DE PROCESO
 * ============================================================================
 */

const procesoIcon: Record<TipoProceso, React.ReactNode> = {
  extrusion: <Waves className="size-5" />,
  flexografia: <Printer className="size-5" />,
  confeccion: <Scissors className="size-5" />,
  bobinado: <Layers className="size-5" />,
};

/**
 * ============================================================================
 * PLANTILLAS DE CONTROL DE CALIDAD
 * ============================================================================
 *
 * La referencia original utiliza una plantilla distinta dependiendo
 * del proceso.
 */

const calidadTemplates: Record<
  TipoProceso,
  {
    caracteristica: string;
    requerido: string;
  }[]
> = {
  extrusion: [
    {
      caracteristica: "Material",
      requerido: "",
    },
    {
      caracteristica: "Color",
      requerido: "",
    },
    {
      caracteristica: "Micraje",
      requerido: "",
    },
    {
      caracteristica: "Ancho",
      requerido: "",
    },
    {
      caracteristica: "Fuelle",
      requerido: "",
    },
  ],

  flexografia: [
    {
      caracteristica: "Diseño",
      requerido: "",
    },
    {
      caracteristica: "Color",
      requerido: "",
    },
    {
      caracteristica: "Tintas",
      requerido: "",
    },
    {
      caracteristica: "Posición",
      requerido: "Centrada",
    },
    {
      caracteristica: "Registro",
      requerido: "Correcto",
    },
  ],

  confeccion: [
    {
      caracteristica: "Ancho",
      requerido: "",
    },
    {
      caracteristica: "Fuelle",
      requerido: "",
    },
    {
      caracteristica: "Sello",
      requerido: "Correcto",
    },
    {
      caracteristica: "Corte",
      requerido: "Correcto",
    },
    {
      caracteristica: "Color",
      requerido: "",
    },
  ],

  bobinado: [
    {
      caracteristica: "Bobinado",
      requerido: "Uniforme",
    },
    {
      caracteristica: "Tensión",
      requerido: "Correcta",
    },
    {
      caracteristica: "Núcleo",
      requerido: "Estándar",
    },
  ],
};

/**
 * ============================================================================
 * ESTILOS
 * ============================================================================
 */

const tabs = [
  {
    value: "ejecucion",
    label: "Ejecución",
  },
  {
    value: "cantidades",
    label: "Cantidades",
  },
  {
    value: "historial",
    label: "Historial",
  },
] as const;

/**
 * ============================================================================
 * PAGE
 * ============================================================================
 */

export default function ProduccionOrdenDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /**
   * --------------------------------------------------------------------------
   * Mock local
   * --------------------------------------------------------------------------
   */

  const [mockData, setMockData] = useState(() => createProduccionMockData());

  /**
   * --------------------------------------------------------------------------
   * UI state
   * --------------------------------------------------------------------------
   */

  const [tab, setTab] = useState("ejecucion");

  const [procesoActivo, setProcesoActivo] = useState<string | null>(null);

  const [finalizarModal, setFinalizarModal] = useState(false);

  const [calidadModal, setCalidadModal] = useState(false);

  const [calidadProceso, setCalidadProceso] = useState<TipoProceso | null>(
    null,
  );

  const [continuarConfirm, setContinuarConfirm] = useState(false);

  const [finalizarDatos, setFinalizarDatos] = useState({
    cantidadProducida: 0,
    cantidadAceptada: 0,
    cantidadRechazada: 0,
    merma: 0,
    observaciones: "",
  });

  const [calidadItems, setCalidadItems] = useState<ControlCalidadItemMock[]>(
    [],
  );

  /**
   * --------------------------------------------------------------------------
   * Buscar orden
   * --------------------------------------------------------------------------
   */

  const orden = useMemo<OrdenProduccionMock | undefined>(() => {
    return mockData.ordenes.find((item) => String(item.id) === String(id));
  }, [mockData.ordenes, id]);

  /**
   * --------------------------------------------------------------------------
   * Loading simulado
   * --------------------------------------------------------------------------
   */

  const isLoading = false;

  /**
   * --------------------------------------------------------------------------
   * Estado inicial de la pantalla
   * --------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <LoadingState
        message="Cargando orden de producción..."
        className="min-h-64"
      />
    );
  }

  if (!orden) {
    return (
      <EmptyState
        title="Orden no encontrada"
        description="La orden de producción solicitada no existe en los datos disponibles."
        action={
          <Button variant="outline" onClick={() => navigate("/produccion")}>
            <ArrowLeft className="size-4" />
            Volver a Producción
          </Button>
        }
      />
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Datos derivados
   * --------------------------------------------------------------------------
   */

  const pasos = orden.ruta.confirmada;

  const pasoActual =
    pasos.find((paso) => paso.estado === "en_proceso") ??
    pasos.find((paso) => paso.estado === "pendiente");

  const cantidadProducidaTotal = pasos.reduce(
    (total, paso) => total + (paso.cantidadProducida ?? 0),
    0,
  );

  const cantidadAceptadaTotal = pasos.reduce(
    (total, paso) => total + (paso.cantidadAceptada ?? 0),
    0,
  );

  const cantidadRechazadaTotal = pasos.reduce(
    (total, paso) => total + (paso.cantidadRechazada ?? 0),
    0,
  );

  const cantidadPendiente = Math.max(0, orden.cantidad - cantidadAceptadaTotal);

  const productoTerminado =
    pasos.length > 0 && pasos.every((paso) => paso.estado === "aprobado");

  /**
   * ==========================================================================
   * HELPERS PARA ACTUALIZAR EL MOCK
   * ==========================================================================
   */

  function actualizarOrden(ordenActualizada: OrdenProduccionMock) {
    setMockData((current) => ({
      ...current,
      ordenes: current.ordenes.map((item) =>
        item.id === ordenActualizada.id ? ordenActualizada : item,
      ),
    }));
  }

  /**
   * ==========================================================================
   * INICIAR PROCESO
   * ==========================================================================
   */

  const iniciarProceso = (pasoId: string) => {
    const ahora = new Date().toISOString();

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,
      ruta: {
        ...orden.ruta,
        confirmada: orden.ruta.confirmada.map((paso) =>
          paso.id === pasoId
            ? {
                ...paso,
                estado: "en_proceso",
                horaInicio: ahora,
                operador: paso.operador ?? "Operador de producción",
              }
            : paso,
        ),
      },
      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de producción",
          accion: `${
            PROCESO_LABELS[
              orden.ruta.confirmada.find((paso) => paso.id === pasoId)
                ?.proceso ?? "extrusion"
            ]
          } iniciada`,
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);
  };

  /**
   * ==========================================================================
   * ABRIR FINALIZAR
   * ==========================================================================
   */

  const abrirFinalizar = (pasoId: string) => {
    setProcesoActivo(pasoId);

    setFinalizarDatos({
      cantidadProducida: orden.cantidad,
      cantidadAceptada: orden.cantidad,
      cantidadRechazada: 0,
      merma: 0,
      observaciones: "",
    });

    setFinalizarModal(true);
  };

  /**
   * ==========================================================================
   * CONFIRMAR FINALIZAR
   * ==========================================================================
   */

  const confirmarFinalizar = () => {
    if (!procesoActivo) {
      return;
    }

    const ahora = new Date().toISOString();

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,

      ruta: {
        ...orden.ruta,
        confirmada: orden.ruta.confirmada.map((paso) =>
          paso.id === procesoActivo
            ? {
                ...paso,
                estado: "finalizado",
                horaFin: ahora,
                cantidadProducida: finalizarDatos.cantidadProducida,
                cantidadAceptada: finalizarDatos.cantidadAceptada,
                cantidadRechazada: finalizarDatos.cantidadRechazada,
                merma: finalizarDatos.merma,
                observaciones: finalizarDatos.observaciones,
              }
            : paso,
        ),
      },

      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de producción",
          accion: "Proceso finalizado",
          observacion:
            finalizarDatos.observaciones ||
            `Producción: ${formatNumber(
              finalizarDatos.cantidadProducida,
            )} unidades`,
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);
    setFinalizarModal(false);
    setProcesoActivo(null);
  };

  /**
   * ==========================================================================
   * ABRIR CALIDAD
   * ==========================================================================
   */

  const abrirCalidad = (proceso: TipoProceso) => {
    const existente = orden.controlesCalidad.find(
      (control) => control.proceso === proceso,
    );

    const template = calidadTemplates[proceso];

    const items =
      existente?.items ??
      template.map((item, index) => ({
        id: `cc-${proceso}-${index}`,
        caracteristica: item.caracteristica,
        requerido: getRequerido(
          proceso,
          item.caracteristica,
          orden.especificaciones,
          item.requerido,
        ),
        medido: "",
        resultado: "cumple" as CalidadResultado,
      }));

    setCalidadProceso(proceso);
    setCalidadItems(items);
    setCalidadModal(true);
  };

  /**
   * ==========================================================================
   * GUARDAR CALIDAD
   * ==========================================================================
   */

  const guardarCalidad = () => {
    if (!calidadProceso) {
      return;
    }

    const aprobado = calidadItems.every(
      (item) => item.resultado !== "no_cumple",
    );

    const ahora = new Date().toISOString();

    const controlExistente = orden.controlesCalidad.find(
      (control) => control.proceso === calidadProceso,
    );

    const nuevoControl = {
      id:
        controlExistente?.id ??
        Math.max(
          0,
          ...orden.controlesCalidad.map((control) => Number(control.id)),
        ) + 1,
      proceso: calidadProceso,
      aprobado,
      fecha: ahora,
      usuario: "Usuario de calidad",
      observaciones: aprobado
        ? "Control de calidad aprobado."
        : "Control de calidad presenta observaciones.",
      items: calidadItems,
    };

    const controlesCalidad = controlExistente
      ? orden.controlesCalidad.map((control) =>
          control.proceso === calidadProceso ? nuevoControl : control,
        )
      : [...orden.controlesCalidad, nuevoControl];

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,

      ruta: {
        ...orden.ruta,
        confirmada: orden.ruta.confirmada.map((paso) =>
          paso.proceso === calidadProceso &&
          paso.estado === "finalizado" &&
          aprobado
            ? {
                ...paso,
                estado: "aprobado",
              }
            : paso,
        ),
      },

      controlesCalidad,

      estado:
        aprobado &&
        orden.ruta.confirmada.every((paso) =>
          paso.proceso === calidadProceso ? true : paso.estado === "aprobado",
        )
          ? "completado"
          : orden.estado,

      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de calidad",
          accion: aprobado
            ? `Control de calidad aprobado · ${PROCESO_LABELS[calidadProceso]}`
            : `Control de calidad observado · ${PROCESO_LABELS[calidadProceso]}`,
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);

    setCalidadModal(false);
    setCalidadItems([]);
    setCalidadProceso(null);
  };

  /**
   * ==========================================================================
   * CONTINUAR SIGUIENTE PROCESO
   * ==========================================================================
   */

  const continuarSiguiente = () => {
    const siguientePaso = orden.ruta.confirmada.find(
      (paso) => paso.estado === "pendiente",
    );

    if (siguientePaso) {
      iniciarProceso(siguientePaso.id);
    }

    setContinuarConfirm(false);
  };

  /**
   * ==========================================================================
   * RENDER
   * ==========================================================================
   */

  return (
    <div className="font-inter">
      <PageHeader
        title={`Orden · ${orden.pedidoNumero}`}
        description={`${orden.clienteNombre} · ${orden.productoNombre}`}
        breadcrumb={[
          {
            label: "Producción",
            href: "/produccion",
          },
          {
            label: orden.pedidoNumero,
          },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/produccion")}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
        }
      />

      {/* ================================================================== */}
      {/* RESUMEN                                                            */}
      {/* ================================================================== */}

      <Card className="mb-6 mt-6 border-2 border-inplaz-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <SummaryItem
              label="Producto"
              value={orden.productoNombre}
              icon={<Package className="size-4" />}
            />

            <SummaryItem
              label="Cantidad"
              value={`${formatNumber(orden.cantidad)} un.`}
            />

            <SummaryItem label="Color" value={orden.especificaciones.color} />

            <SummaryItem
              label="Micraje"
              value={`${orden.especificaciones.micraje} µm`}
            />

            <SummaryItem
              label="Ancho"
              value={`${orden.especificaciones.ancho} cm`}
            />

            <SummaryItem
              label="Material"
              value={orden.especificaciones.material}
            />
          </div>

          {orden.especificaciones.fuelle > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-start gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Ruta:</span>

                <div className="flex flex-wrap items-center gap-1.5">
                  {pasos.map((paso, index) => (
                    <span key={paso.id} className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {PROCESO_LABELS[paso.proceso]}
                      </span>

                      {index < pasos.length - 1 && (
                        <ArrowRight className="size-3 text-muted-foreground/50" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* PROGRESO DE RUTA                                                   */}
      {/* ================================================================== */}

      <Card className="mb-6">
        <CardContent className="overflow-x-auto p-6">
          <div className="flex min-w-max items-center gap-1 pb-2">
            {pasos.map((paso, index) => {
              const estado = paso.estado;

              const procesoActual = estado === "en_proceso";

              return (
                <div key={paso.id} className="flex shrink-0 items-center gap-1">
                  <div
                    className={cn(
                      "flex min-w-[120px] flex-col items-center gap-1.5 rounded-lg border px-3 py-2",
                      estado === "aprobado" && "border-brand-300 bg-brand-50",

                      estado === "en_proceso" &&
                        "border-inplaz-300 bg-inplaz-50",

                      estado === "finalizado" && "border-amber-300 bg-amber-50",

                      estado === "rechazado" &&
                        "border-danger-300 bg-danger-50",

                      estado === "pendiente" && "border-slate-200 bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full",

                        estado === "aprobado" && "bg-brand-600 text-white",

                        estado === "en_proceso" && "bg-inplaz-600 text-white",

                        estado === "finalizado" && "bg-amber-500 text-white",

                        estado === "rechazado" && "bg-danger-600 text-white",

                        estado === "pendiente" && "bg-slate-200 text-slate-400",
                      )}
                    >
                      {estado === "aprobado" ? (
                        <CheckCircle2 className="size-5" />
                      ) : procesoActual ? (
                        <span className="size-2.5 animate-pulse rounded-full bg-white" />
                      ) : estado === "finalizado" ? (
                        <Clock className="size-4" />
                      ) : estado === "rechazado" ? (
                        <XCircle className="size-5" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>

                    <span
                      className={cn(
                        "text-center text-xs font-medium",
                        estado === "pendiente"
                          ? "text-slate-400"
                          : "text-slate-700",
                      )}
                    >
                      {PROCESO_LABELS[paso.proceso]}
                    </span>

                    <Badge
                      variant="outline"
                      className={cn(
                        "px-1.5 py-0.5 text-[11px]",
                        PROCESO_ESTADO_COLORS[estado],
                      )}
                    >
                      {PROCESO_ESTADO_LABELS[estado]}
                    </Badge>
                  </div>

                  {index < pasos.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-3",
                        estado === "aprobado" ? "bg-brand-400" : "bg-slate-200",
                      )}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex shrink-0 items-center gap-1">
              <div
                className={cn(
                  "h-0.5 w-3",
                  productoTerminado ? "bg-brand-400" : "bg-slate-200",
                )}
              />

              <div
                className={cn(
                  "flex min-w-[120px] flex-col items-center gap-1.5 rounded-lg border px-3 py-2",
                  productoTerminado
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-200 bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    productoTerminado
                      ? "bg-brand-600 text-white"
                      : "bg-slate-200 text-slate-400",
                  )}
                >
                  <CheckCircle2 className="size-5" />
                </div>

                <span className="text-center text-xs font-medium text-slate-600">
                  Producto Terminado
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* TABS                                                               */}
      {/* ================================================================== */}

      <Tabs
        value={tab}
        items={[
          {
            value: tabs[0].value,
            label: tabs[0].label,
          },
          {
            value: tabs[1].value,
            label: tabs[1].label,
          },
          {
            value: tabs[2].value,
            label: tabs[2].label,
            count: orden.historial.length,
          },
        ]}
        onChange={setTab}
      />

      {/* ================================================================== */}
      {/* EJECUCIÓN                                                          */}
      {/* ================================================================== */}

      {tab === "ejecucion" && (
        <div className="mt-4 space-y-4">
          {pasos.map((paso, index) => {
            const estado = paso.estado;

            const controlCalidad = orden.controlesCalidad.find(
              (control) => control.proceso === paso.proceso,
            );

            const esPasoActual = paso.id === pasoActual?.id;

            const ProcesoIcon = PROCESO_ICONS[paso.proceso];

            return (
              <Card
                key={paso.id}
                className={cn(esPasoActual && "border-2 border-inplaz-300")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* ---------------------------------------------------- */}
                    {/* Icono del proceso                                    */}
                    {/* ---------------------------------------------------- */}

                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl",

                        estado === "aprobado" && "bg-brand-100 text-brand-600",

                        estado === "en_proceso" &&
                          "bg-inplaz-100 text-inplaz-600",

                        estado === "finalizado" &&
                          "bg-amber-100 text-amber-600",

                        estado === "rechazado" &&
                          "bg-danger-100 text-danger-600",

                        estado === "pendiente" && "bg-slate-100 text-slate-400",
                      )}
                    >
                      <ProcesoIcon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* -------------------------------------------------- */}
                      {/* Header                                             */}
                      {/* -------------------------------------------------- */}

                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-bold text-foreground">
                          Paso {index + 1}: {PROCESO_LABELS[paso.proceso]}
                        </span>

                        <Badge
                          variant="outline"
                          className={cn(
                            "border",
                            PROCESO_ESTADO_COLORS[estado],
                          )}
                        >
                          {PROCESO_ESTADO_LABELS[estado]}
                        </Badge>

                        {paso.maquinaNombre && (
                          <Badge
                            variant="outline"
                            className="border-inplaz-300 bg-inplaz-100 text-inplaz-700"
                          >
                            <Factory className="size-3" />
                            {paso.maquinaNombre}
                          </Badge>
                        )}
                      </div>

                      {/* -------------------------------------------------- */}
                      {/* Información de ejecución                           */}
                      {/* -------------------------------------------------- */}

                      {paso.operador && (
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {paso.operador}
                          </span>

                          {paso.horaInicio && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              Inicio: {formatDateTime(paso.horaInicio)}
                            </span>
                          )}

                          {paso.horaFin && (
                            <span>Fin: {formatDateTime(paso.horaFin)}</span>
                          )}

                          {paso.duracion && (
                            <span className="font-medium text-foreground">
                              Duración: {paso.duracion}
                            </span>
                          )}
                        </div>
                      )}

                      {/* -------------------------------------------------- */}
                      {/* Acciones                                           */}
                      {/* -------------------------------------------------- */}

                      <div className="flex flex-wrap items-center gap-2">
                        {estado === "pendiente" && esPasoActual && (
                          <Button
                            size="sm"
                            onClick={() => iniciarProceso(paso.id)}
                          >
                            <Play className="size-3.5" />
                            Iniciar producción
                          </Button>
                        )}

                        {estado === "pendiente" && !esPasoActual && (
                          <span className="text-xs italic text-muted-foreground">
                            Esperando proceso anterior
                          </span>
                        )}

                        {estado === "en_proceso" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => abrirFinalizar(paso.id)}
                          >
                            <Square className="size-3.5" />
                            Finalizar proceso
                          </Button>
                        )}

                        {estado === "finalizado" && !controlCalidad && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => abrirCalidad(paso.proceso)}
                          >
                            <ClipboardCheck className="size-3.5" />
                            Registrar control de calidad
                          </Button>
                        )}

                        {controlCalidad && (
                          <Badge
                            variant="outline"
                            className={
                              controlCalidad.aprobado
                                ? "border-brand-300 bg-brand-100 text-brand-700"
                                : "border-danger-300 bg-danger-100 text-danger-700"
                            }
                          >
                            <ClipboardCheck className="size-3" />
                            Calidad{" "}
                            {controlCalidad.aprobado ? "aprobada" : "rechazada"}
                          </Badge>
                        )}

                        {controlCalidad?.aprobado &&
                          index < pasos.length - 1 &&
                          pasos[index + 1].estado === "pendiente" && (
                            <Button
                              size="sm"
                              onClick={() => setContinuarConfirm(true)}
                            >
                              <ArrowRight className="size-3.5" />
                              Continuar al siguiente proceso
                            </Button>
                          )}

                        {controlCalidad?.aprobado &&
                          index === pasos.length - 1 && (
                            <Badge
                              variant="outline"
                              className="border-brand-300 bg-brand-100 text-brand-700"
                            >
                              <CheckCircle2 className="size-3" />
                              Proceso finalizado
                            </Badge>
                          )}
                      </div>

                      {/* -------------------------------------------------- */}
                      {/* Cantidades                                         */}
                      {/* -------------------------------------------------- */}

                      {paso.cantidadProducida !== undefined && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                          <CantidadCard
                            label="Producida"
                            value={paso.cantidadProducida}
                            bg="bg-slate-50"
                            color="text-slate-700"
                          />

                          <CantidadCard
                            label="Aceptada"
                            value={paso.cantidadAceptada ?? 0}
                            bg="bg-brand-50"
                            color="text-brand-700"
                          />

                          <CantidadCard
                            label="Rechazada"
                            value={paso.cantidadRechazada ?? 0}
                            bg="bg-danger-50"
                            color="text-danger-700"
                          />

                          <CantidadCard
                            label="Merma"
                            value={paso.merma ?? 0}
                            bg="bg-amber-50"
                            color="text-amber-700"
                          />
                        </div>
                      )}

                      {/* -------------------------------------------------- */}
                      {/* Control de calidad                                */}
                      {/* -------------------------------------------------- */}

                      {controlCalidad && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-border">
                          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <ClipboardCheck className="size-3.5" />
                            Control de calidad -{" "}
                            {PROCESO_LABELS[controlCalidad.proceso]}
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                  <th className="px-3 py-1.5 text-left font-medium">
                                    Característica
                                  </th>

                                  <th className="px-3 py-1.5 text-left font-medium">
                                    Requerido
                                  </th>

                                  <th className="px-3 py-1.5 text-left font-medium">
                                    Medido
                                  </th>

                                  <th className="px-3 py-1.5 text-center font-medium">
                                    Resultado
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {controlCalidad.items.map((item) => (
                                  <tr
                                    key={item.id}
                                    className="border-b border-border/50"
                                  >
                                    <td className="px-3 py-1.5 text-foreground">
                                      {item.caracteristica}
                                    </td>

                                    <td className="px-3 py-1.5 text-muted-foreground">
                                      {item.requerido}
                                    </td>

                                    <td className="px-3 py-1.5 font-medium text-foreground">
                                      {item.medido}
                                    </td>

                                    <td className="px-3 py-1.5 text-center">
                                      {item.resultado === "cumple" && (
                                        <CheckCircle2 className="inline size-4 text-brand-600" />
                                      )}

                                      {item.resultado === "observado" && (
                                        <AlertTriangle className="inline size-4 text-amber-500" />
                                      )}

                                      {item.resultado === "no_cumple" && (
                                        <XCircle className="inline size-4 text-danger-600" />
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ================================================================== */}
      {/* CANTIDADES                                                         */}
      {/* ================================================================== */}

      {tab === "cantidades" && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <CantidadCard
                label="Solicitada"
                value={orden.cantidad}
                color="text-slate-700"
                bg="bg-slate-50"
              />

              <CantidadCard
                label="Planificada"
                value={orden.cantidad}
                color="text-inplaz-700"
                bg="bg-inplaz-50"
              />

              <CantidadCard
                label="Producida"
                value={cantidadProducidaTotal}
                color="text-inplaz-700"
                bg="bg-inplaz-50"
              />

              <CantidadCard
                label="Aprobada"
                value={cantidadAceptadaTotal}
                color="text-brand-700"
                bg="bg-brand-50"
              />

              <CantidadCard
                label="Rechazada"
                value={cantidadRechazadaTotal}
                color="text-danger-700"
                bg="bg-danger-50"
              />

              <CantidadCard
                label="Pendiente"
                value={cantidadPendiente}
                color="text-amber-700"
                bg="bg-amber-50"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================================================================== */}
      {/* HISTORIAL                                                          */}
      {/* ================================================================== */}

      {tab === "historial" && (
        <Card className="mt-4">
          <CardContent className="p-6">
            {orden.historial.length === 0 ? (
              <EmptyState
                title="Sin historial"
                description="Todavía no existen eventos registrados para esta orden."
                icon={<HistoryIcon className="size-6" />}
              />
            ) : (
              <div className="space-y-4">
                {orden.historial.map((evento, index) => (
                  <div key={evento.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",

                          index === 0
                            ? "bg-brand-100 text-brand-600"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        <HistoryIcon className="size-4" />
                      </div>

                      {index < orden.historial.length - 1 && (
                        <div className="my-1 w-0.5 flex-1 bg-slate-200" />
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{evento.usuario}</span> ·{" "}
                        {evento.accion}
                      </p>

                      {evento.observacion && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {evento.observacion}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatDateTime(evento.fecha)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ================================================================== */}
      {/* MODAL - FINALIZAR PROCESO                                           */}
      {/* ================================================================== */}

      <Modal
        open={finalizarModal}
        onClose={() => setFinalizarModal(false)}
        size="md"
      >
        <ModalHeader>
          <ModalTitle>Finalizar proceso</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Cantidad producida</Label>

                <Input
                  type="number"
                  value={finalizarDatos.cantidadProducida || ""}
                  onChange={(event) =>
                    setFinalizarDatos((current) => ({
                      ...current,
                      cantidadProducida: Number(event.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Cantidad aceptada</Label>

                <Input
                  type="number"
                  value={finalizarDatos.cantidadAceptada || ""}
                  onChange={(event) =>
                    setFinalizarDatos((current) => ({
                      ...current,
                      cantidadAceptada: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Cantidad rechazada</Label>

                <Input
                  type="number"
                  value={finalizarDatos.cantidadRechazada || ""}
                  onChange={(event) =>
                    setFinalizarDatos((current) => ({
                      ...current,
                      cantidadRechazada: Number(event.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Merma</Label>

                <Input
                  type="number"
                  value={finalizarDatos.merma || ""}
                  onChange={(event) =>
                    setFinalizarDatos((current) => ({
                      ...current,
                      merma: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Observaciones</Label>

              <Textarea
                rows={3}
                value={finalizarDatos.observaciones}
                onChange={(event) =>
                  setFinalizarDatos((current) => ({
                    ...current,
                    observaciones: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="outline" onClick={() => setFinalizarModal(false)}>
            Cancelar
          </Button>

          <Button variant="destructive" onClick={confirmarFinalizar}>
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================================================================== */}
      {/* MODAL - CONTROL DE CALIDAD                                          */}
      {/* ================================================================== */}

      <Modal
        open={calidadModal}
        onClose={() => {
          setCalidadModal(false);
          setCalidadProceso(null);
        }}
        size="xl"
      >
        <ModalHeader>
          <ModalTitle>Control de calidad</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-3">
            {calidadItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 lg:flex-row lg:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <Label className="text-xs">Característica</Label>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {item.caracteristica}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs">Requerido</Label>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.requerido}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs">Medido (real)</Label>

                      <Input
                        value={item.medido}
                        onChange={(event) =>
                          setCalidadItems((items) =>
                            items.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentItem,
                                    medido: event.target.value,
                                  }
                                : currentItem,
                            ),
                          )
                        }
                        className="py-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Label className="text-xs">Resultado</Label>

                  <div className="mt-1 flex items-center gap-1">
                    {(
                      ["cumple", "observado", "no_cumple"] as CalidadResultado[]
                    ).map((resultado) => (
                      <button
                        key={resultado}
                        type="button"
                        onClick={() =>
                          setCalidadItems((items) =>
                            items.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentItem,
                                    resultado,
                                  }
                                : currentItem,
                            ),
                          )
                        }
                        className={cn(
                          "rounded-lg border p-1.5 transition",
                          item.resultado === resultado
                            ? CALIDAD_RESULTADO_COLORS[resultado]
                            : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50",
                        )}
                        title={CALIDAD_RESULTADO_LABELS[resultado]}
                      >
                        {resultado === "cumple" && (
                          <CheckCircle2 className="size-4" />
                        )}

                        {resultado === "observado" && (
                          <AlertTriangle className="size-4" />
                        )}

                        {resultado === "no_cumple" && (
                          <XCircle className="size-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {calidadItems.some((item) => item.resultado === "no_cumple") && (
              <div className="rounded-lg border border-danger-200 bg-danger-50 p-3 text-sm text-danger-700">
                <AlertTriangle className="mr-1 inline size-4" />
                El proceso no puede continuar hasta resolver las observaciones.
              </div>
            )}
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCalidadModal(false);
              setCalidadProceso(null);
            }}
          >
            Cancelar
          </Button>

          <Button onClick={guardarCalidad}>Guardar control</Button>
        </ModalFooter>
      </Modal>

      {/* ================================================================== */}
      {/* CONFIRMAR CONTINUAR                                                 */}
      {/* ================================================================== */}

      <ConfirmDialog
        open={continuarConfirm}
        onClose={() => setContinuarConfirm(false)}
        onConfirm={continuarSiguiente}
        title="Continuar al siguiente proceso"
        message="¿Confirmar que el proceso actual fue aprobado y desea iniciar el siguiente?"
        confirmLabel="Continuar"
      />
    </div>
  );
}

/**
 * ============================================================================
 * REQUERIDO PARA CONTROL DE CALIDAD
 * ============================================================================
 */

function getRequerido(
  proceso: TipoProceso,
  caracteristica: string,
  specs: OrdenProduccionMock["especificaciones"],
  templateValue: string,
): string {
  const map: Record<string, string> = {
    Material: specs.material,
    Color: specs.color,
    Micraje: `${specs.micraje} µm`,
    Ancho: `${specs.ancho} cm`,
    Fuelle: specs.fuelle > 0 ? `${specs.fuelle} cm` : "N/A",

    Diseño: specs.tipoImpresion,

    Tintas: String(specs.coloresImpresion),
  };

  /**
   * Algunos datos son propios de la plantilla del proceso
   * y no de las especificaciones generales.
   */
  if (proceso === "flexografia" && caracteristica === "Posición") {
    return templateValue;
  }

  if (proceso === "flexografia" && caracteristica === "Registro") {
    return templateValue;
  }

  if (proceso === "confeccion" && ["Sello", "Corte"].includes(caracteristica)) {
    return templateValue;
  }

  if (
    proceso === "bobinado" &&
    ["Bobinado", "Tensión", "Núcleo"].includes(caracteristica)
  ) {
    return templateValue;
  }

  return map[caracteristica] ?? templateValue;
}

/**
 * ============================================================================
 * SUMMARY ITEM
 * ============================================================================
 */

interface SummaryItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function SummaryItem({ label, value, icon }: SummaryItemProps) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

/**
 * ============================================================================
 * CANTIDAD CARD
 * ============================================================================
 */

interface CantidadCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}

function CantidadCard({ label, value, color, bg }: CantidadCardProps) {
  return (
    <div className={cn("rounded-lg p-4 text-center", bg)}>
      <p className="mb-1 text-xs text-slate-500">{label}</p>

      <p className={cn("text-2xl font-bold", color)}>{formatNumber(value)}</p>
    </div>
  );
}
