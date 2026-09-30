import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Cpu,
  Factory,
  GripVertical,
  Layers,
  Package,
  Play,
  Plus,
  ShieldCheck,
  Trash2,
  Waves,
  Printer,
  Scissors,
} from "lucide-react";

import {
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
  Select,
} from "../../components/ui";

import { cn } from "../../lib/cn";

import {
  EQUIPO_ESTADO_COLORS,
  EQUIPO_ESTADO_LABELS,
  ORDEN_ESTADO_COLORS,
  ORDEN_ESTADO_LABELS,
  PRIORIDAD_DOTS,
  PRIORIDAD_LABELS,
  PROCESO_EQUIPO_LABELS,
  PROCESO_LABELS,
  PROCESOS_DISPONIBLES,
} from "./produccion.constants";

import { createProduccionMockData } from "./produccion.mock";

import type {
  MateriaPrimaMock,
  OrdenProduccionMock,
  PasoRutaMock,
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
 * ESTILOS
 * ============================================================================
 */

const GREEN_STATUS_CLASS = "border-brand-200 bg-brand-50 text-brand-700";

/**
 * ============================================================================
 * PAGE
 * ============================================================================
 */

export default function ProduccionPlanificacionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /**
   * --------------------------------------------------------------------------
   * Mock
   * --------------------------------------------------------------------------
   */

  const [mockData, setMockData] = useState(() => createProduccionMockData());

  /**
   * --------------------------------------------------------------------------
   * UI STATE
   * --------------------------------------------------------------------------
   */

  const [rutaEditada, setRutaEditada] = useState<PasoRutaMock[]>([]);

  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrimaMock[]>([]);

  const [materiaModalOpen, setMateriaModalOpen] = useState(false);

  const [producirModalOpen, setProducirModalOpen] = useState(false);

  const [addProcesoOpen, setAddProcesoOpen] = useState(false);

  const [nuevoProceso, setNuevoProceso] = useState<TipoProceso>("extrusion");

  const [nuevaMateria, setNuevaMateria] = useState<Partial<MateriaPrimaMock>>(
    {},
  );

  /**
   * --------------------------------------------------------------------------
   * Orden
   * --------------------------------------------------------------------------
   */

  const orden = useMemo<OrdenProduccionMock | undefined>(
    () => mockData.ordenes.find((item) => String(item.id) === String(id)),
    [mockData.ordenes, id],
  );

  /**
   * --------------------------------------------------------------------------
   * Loading
   * --------------------------------------------------------------------------
   */

  const isLoading = false;

  if (isLoading) {
    return (
      <LoadingState message="Cargando planificación..." className="min-h-64" />
    );
  }

  if (!orden) {
    return (
      <EmptyState
        title="Orden no encontrada"
        description="No se encontró la orden de producción solicitada."
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
   * Estado calculado
   * --------------------------------------------------------------------------
   */

  const rutaPropuesta = orden.ruta.propuesta;

  const rutaYaConfirmada =
    orden.estado !== "viable" && orden.estado !== "en_planificacion";

  /**
   * --------------------------------------------------------------------------
   * Ruta actual editable
   * --------------------------------------------------------------------------
   */

  const rutaActual = useMemo<PasoRutaMock[]>(() => {
    if (rutaEditada.length > 0) {
      return rutaEditada;
    }

    if (rutaYaConfirmada && orden.ruta.confirmada.length > 0) {
      return orden.ruta.confirmada;
    }

    if (orden.ruta.propuesta.length > 0) {
      return orden.ruta.propuesta;
    }

    return [];
  }, [orden, rutaEditada, rutaYaConfirmada]);

  /**
   * --------------------------------------------------------------------------
   * Detectar modificación de ruta
   * --------------------------------------------------------------------------
   */

  const rutaEsDiferente =
    JSON.stringify(rutaActual.map((paso) => paso.proceso)) !==
    JSON.stringify(rutaPropuesta.map((paso) => paso.proceso));

  /**
   * --------------------------------------------------------------------------
   * Materia prima
   * --------------------------------------------------------------------------
   */

  const materiasRegistradas =
    orden.estado === "materia_prima_lista" ||
    orden.estado === "en_produccion" ||
    orden.estado === "completado";

  const materiasActuales = materiasRegistradas
    ? orden.materiasPrimas
    : materiasPrimas;

  const totalMateriaPrima = materiasActuales.reduce(
    (total, materia) => total + materia.cantidadUtilizar,
    0,
  );

  /**
   * ==========================================================================
   * HELPERS DE MOCK
   * ==========================================================================*
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
   * RUTA
   * ==========================================================================
   */

  const moverPaso = (index: number, direccion: "arriba" | "abajo") => {
    const nuevaRuta = [...rutaActual];

    const swapIndex = direccion === "arriba" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= nuevaRuta.length) {
      return;
    }

    [nuevaRuta[index], nuevaRuta[swapIndex]] = [
      nuevaRuta[swapIndex],
      nuevaRuta[index],
    ];

    const normalizada = nuevaRuta.map((paso, pasoIndex) => ({
      ...paso,
      orden: pasoIndex + 1,
    }));

    setRutaEditada(normalizada);
  };

  const eliminarPaso = (index: number) => {
    const nuevaRuta = rutaActual
      .filter((_, currentIndex) => currentIndex !== index)
      .map((paso, pasoIndex) => ({
        ...paso,
        orden: pasoIndex + 1,
      }));

    setRutaEditada(nuevaRuta);
  };

  const agregarProceso = () => {
    const nuevoPaso: PasoRutaMock = {
      id: `edit-${Date.now()}`,
      proceso: nuevoProceso,
      orden: rutaActual.length + 1,
      estado: "pendiente",
    };

    setRutaEditada([...rutaActual, nuevoPaso]);

    setAddProcesoOpen(false);
  };

  /**
   * ==========================================================================
   * MÁQUINAS
   * ==========================================================================
   */

  const maquinasPorProceso = (proceso: TipoProceso) => {
    const expectedType = PROCESO_EQUIPO_LABELS[proceso].toLowerCase();

    return mockData.equipos.filter(
      (equipo) =>
        equipo.tipo.toLowerCase().includes(expectedType) ||
        equipo.nombre.toLowerCase().includes(expectedType),
    );
  };

  const asignarMaquina = (pasoId: string, maquinaIdValue: string) => {
    const maquina = mockData.equipos.find(
      (equipo) => String(equipo.id) === maquinaIdValue,
    );

    const nuevaRuta = rutaActual.map((paso) =>
      paso.id === pasoId
        ? {
            ...paso,
            maquinaId: maquina?.id,
            maquinaNombre: maquina?.codigo,
          }
        : paso,
    );

    setRutaEditada(nuevaRuta);
  };

  /**
   * ==========================================================================
   * CONFIRMAR RUTA
   * ==========================================================================
   */

  const confirmarRuta = () => {
    const ahora = new Date().toISOString();

    const rutaConfirmada = rutaActual.map((paso, index) => ({
      ...paso,
      orden: index + 1,
    }));

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,

      estado: "ruta_confirmada",

      ruta: {
        ...orden.ruta,
        propuesta: rutaPropuesta,
        confirmada: rutaConfirmada,
        confirmadaPor: "Usuario de producción",
        fechaConfirmacion: ahora,
      },

      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de producción",
          accion: "Ruta confirmada",
          observacion: rutaConfirmada
            .map((paso) => PROCESO_LABELS[paso.proceso])
            .join(" → "),
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);
    setRutaEditada([]);
  };

  /**
   * ==========================================================================
   * MATERIAS PRIMAS
   * ==========================================================================
   */

  const agregarMateria = () => {
    if (!nuevaMateria.nombre) {
      return;
    }

    const nuevoId =
      Math.max(
        0,
        ...mockData.materiasPrimasDisponibles.map((materia) =>
          Number(materia.id),
        ),
        ...materiasActuales.map((materia) => Number(materia.id)),
      ) + 1;

    const materia: MateriaPrimaMock = {
      id: nuevoId,
      nombre: nuevaMateria.nombre,
      tipo: nuevaMateria.tipo ?? "",
      lote: nuevaMateria.lote ?? "",
      cantidadPlanificada: nuevaMateria.cantidadPlanificada ?? 0,
      unidad: nuevaMateria.unidad ?? "kg",
      cantidadDisponible: nuevaMateria.cantidadDisponible ?? 0,
      cantidadUtilizar: nuevaMateria.cantidadUtilizar ?? 0,
      observaciones: nuevaMateria.observaciones ?? "",
    };

    setMateriasPrimas((current) => [...current, materia]);

    setNuevaMateria({});
    setMateriaModalOpen(false);
  };

  const eliminarMateria = (materiaId: number) => {
    setMateriasPrimas((current) =>
      current.filter((materia) => materia.id !== materiaId),
    );
  };

  const guardarMaterias = () => {
    const ahora = new Date().toISOString();

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,
      estado: "materia_prima_lista",

      materiasPrimas: materiasPrimas,

      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de producción",
          accion: "Materia prima registrada",
          observacion: `${materiasPrimas.length} materiales asignados.`,
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);
    setMateriasPrimas([]);
  };

  /**
   * ==========================================================================
   * PONER A PRODUCIR
   * ==========================================================================
   */

  const ponerAProducir = () => {
    const ahora = new Date().toISOString();

    const ordenActualizada: OrdenProduccionMock = {
      ...orden,

      estado: "en_produccion",

      ruta: {
        ...orden.ruta,
        confirmada: rutaActual.length > 0 ? rutaActual : orden.ruta.confirmada,
      },

      historial: [
        ...orden.historial,
        {
          id:
            Math.max(0, ...orden.historial.map((evento) => Number(evento.id))) +
            1,
          usuario: "Usuario de producción",
          accion: "Orden puesta a producir",
          fecha: ahora,
        },
      ],
    };

    actualizarOrden(ordenActualizada);

    setProducirModalOpen(false);

    navigate(`/produccion/orden/${orden.id}`);
  };

  /**
   * ==========================================================================
   * RENDER
   * ==========================================================================
   */

  return (
    <div className="font-inter">
      <PageHeader
        title={`Planificación · ${orden.pedidoNumero}`}
        description={`${orden.clienteNombre} · ${orden.productoNombre}`}
        breadcrumb={[
          {
            label: "Producción",
            href: "/produccion",
          },
          {
            label: "Planificación",
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
      {/* ESTADO                                                             */}
      {/* ================================================================== */}

      <div
        className={cn(
          "mb-6 mt-6 flex items-center gap-3 rounded-xl border p-4",
          ORDEN_ESTADO_COLORS[orden.estado],
        )}
      >
        <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />

        <span className="text-sm font-medium">
          {ORDEN_ESTADO_LABELS[orden.estado]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ================================================================== */}
        {/* INFORMACIÓN IZQUIERDA                                              */}
        {/* ================================================================== */}

        <div className="space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* Información del pedido                                           */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle>Información del pedido</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <InfoRow label="Solicitud" value={orden.pedidoNumero} />

              <InfoRow label="Cliente" value={orden.clienteNombre} />

              <InfoRow label="Producto" value={orden.productoNombre} />

              <InfoRow
                label="Cantidad solicitada"
                value={`${formatNumber(orden.cantidad)} un.`}
              />

              <InfoRow
                label="Fecha requerida"
                value={formatDate(orden.fechaRequerida)}
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Prioridad</span>

                <Badge
                  variant="outline"
                  className="border-brand-200 bg-brand-50 text-brand-700"
                >
                  <span
                    className={cn(
                      "mr-1.5 size-1.5 rounded-full",
                      PRIORIDAD_DOTS[orden.prioridad],
                    )}
                  />

                  {PRIORIDAD_LABELS[orden.prioridad]}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Viabilidad
                </span>

                <Badge variant="outline" className={GREEN_STATUS_CLASS}>
                  <CheckCircle2 className="size-3" />
                  Viable
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Especificaciones                                                 */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />

                <CardTitle>Especificaciones del producto</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <SpecRow
                label="Tipo de producto"
                value={orden.especificaciones.tipoProducto}
              />

              <SpecRow
                label="Material"
                value={orden.especificaciones.material}
              />

              <SpecRow
                label="Micraje"
                value={`${orden.especificaciones.micraje} µm`}
              />

              <SpecRow
                label="Ancho"
                value={`${orden.especificaciones.ancho} cm`}
              />

              <SpecRow
                label="Ancho doblado"
                value={`${orden.especificaciones.anchoDoblado} cm`}
              />

              <SpecRow
                label="Ancho desdoblado"
                value={`${orden.especificaciones.anchoDesdoblado} cm`}
              />

              <SpecRow
                label="Fuelle"
                value={
                  orden.especificaciones.fuelle > 0
                    ? `${orden.especificaciones.fuelle} cm`
                    : "Sin fuelle"
                }
              />

              <SpecRow label="Color" value={orden.especificaciones.color} />

              <SpecRow
                label="Número de capas"
                value={String(orden.especificaciones.numeroCapas)}
              />

              <SpecRow
                label="Tipo de impresión"
                value={orden.especificaciones.tipoImpresion}
              />

              {orden.especificaciones.coloresImpresion > 0 && (
                <SpecRow
                  label="Colores de impresión"
                  value={String(orden.especificaciones.coloresImpresion)}
                />
              )}

              <SpecRow
                label="Tipo de sello"
                value={orden.especificaciones.tipoSello}
              />

              {orden.especificaciones.otras && (
                <SpecRow label="Otras" value={orden.especificaciones.otras} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* ================================================================== */}
        {/* CONTENIDO DERECHO                                                  */}
        {/* ================================================================== */}

        <div className="space-y-6 lg:col-span-2">
          {/* ---------------------------------------------------------------- */}
          {/* RUTA                                                             */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="size-4 text-muted-foreground" />

                  <CardTitle>Recorrido de producción</CardTitle>
                </div>

                {!rutaYaConfirmada && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddProcesoOpen(true)}
                  >
                    <Plus className="size-3.5" />
                    Agregar proceso
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* ------------------------------------------------------------ */}
              {/* Ruta propuesta                                                */}
              {/* ------------------------------------------------------------ */}

              <div className="mb-5">
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  Ruta propuesta (desde viabilidad)
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {rutaPropuesta.map((paso, index) => (
                    <div key={paso.id} className="flex items-center gap-2">
                      <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                        {PROCESO_LABELS[paso.proceso]}
                      </span>

                      {index < rutaPropuesta.length - 1 && (
                        <ArrowRight className="size-4 text-slate-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Ruta editable                                                 */}
              {/* ------------------------------------------------------------ */}

              <div
                className={cn(
                  "rounded-lg border-2 p-4",
                  rutaEsDiferente
                    ? "border-amber-300 bg-amber-50/30"
                    : "border-slate-200 bg-slate-50/30",
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {rutaYaConfirmada ? "Ruta confirmada" : "Ruta a confirmar"}

                    {rutaEsDiferente && !rutaYaConfirmada && (
                      <span className="ml-2 text-amber-600">(modificada)</span>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  {rutaActual.map((paso, index) => {
                    const maquinas = maquinasPorProceso(paso.proceso);

                    return (
                      <div
                        key={paso.id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                          {/* ------------------------------------------------ */}
                          {/* Ordenamiento                                     */}
                          {/* ------------------------------------------------ */}

                          {!rutaYaConfirmada && (
                            <div className="flex shrink-0 items-center gap-1 xl:flex-col">
                              <button
                                type="button"
                                onClick={() => moverPaso(index, "arriba")}
                                disabled={index === 0}
                                className="rounded p-0.5 text-slate-400 transition hover:text-slate-600 disabled:opacity-30"
                                aria-label="Mover proceso arriba"
                              >
                                <ChevronUp className="size-3.5" />
                              </button>

                              <GripVertical className="size-3.5 text-slate-300" />

                              <button
                                type="button"
                                onClick={() => moverPaso(index, "abajo")}
                                disabled={index === rutaActual.length - 1}
                                className="rounded p-0.5 text-slate-400 transition hover:text-slate-600 disabled:opacity-30"
                                aria-label="Mover proceso abajo"
                              >
                                <ChevronDown className="size-3.5" />
                              </button>
                            </div>
                          )}

                          {/* ------------------------------------------------ */}
                          {/* Proceso                                         */}
                          {/* ------------------------------------------------ */}

                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg",
                              paso.estado === "aprobado"
                                ? "bg-brand-100 text-brand-600"
                                : paso.estado === "en_proceso"
                                  ? "bg-inplaz-100 text-inplaz-600"
                                  : paso.estado === "finalizado"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-slate-100 text-slate-500",
                            )}
                          >
                            {procesoIcon[paso.proceso]}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">
                                Paso {index + 1}
                              </span>

                              <span className="text-sm font-semibold text-slate-800">
                                {PROCESO_LABELS[paso.proceso]}
                              </span>
                            </div>

                            {paso.estado !== "pendiente" && (
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {paso.operador && `Operador: ${paso.operador}`}

                                {paso.cantidadProducida !== undefined &&
                                  ` · ${formatNumber(
                                    paso.cantidadProducida,
                                  )} producidas`}
                              </span>
                            )}
                          </div>

                          {/* ------------------------------------------------ */}
                          {/* Máquina                                         */}
                          {/* ------------------------------------------------ */}

                          <div className="flex flex-wrap items-center gap-2">
                            {!rutaYaConfirmada ? (
                              <Select
                                value={
                                  paso.maquinaId != null
                                    ? String(paso.maquinaId)
                                    : ""
                                }
                                onChange={(event) =>
                                  asignarMaquina(paso.id, event.target.value)
                                }
                                className="w-full text-xs sm:w-48"
                              >
                                <option value="">Sin máquina</option>

                                {maquinas.map((maquina) => (
                                  <option
                                    key={maquina.id}
                                    value={String(maquina.id)}
                                    disabled={
                                      maquina.estado === "mantenimiento" ||
                                      maquina.estado === "fuera_servicio"
                                    }
                                  >
                                    {maquina.codigo} ·{" "}
                                    {EQUIPO_ESTADO_LABELS[maquina.estado]}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              paso.maquinaNombre && (
                                <Badge
                                  variant="outline"
                                  className="border-inplaz-300 bg-inplaz-100 text-inplaz-700"
                                >
                                  <Cpu className="size-3" />
                                  {paso.maquinaNombre}
                                </Badge>
                              )
                            )}

                            {!rutaYaConfirmada && (
                              <button
                                type="button"
                                onClick={() => eliminarPaso(index)}
                                className="rounded-lg p-1.5 text-danger-500 transition hover:bg-danger-50"
                                aria-label="Eliminar proceso"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* -------------------------------------------------- */}
                        {/* Información de máquina                           */}
                        {/* -------------------------------------------------- */}

                        {paso.maquinaId != null && (
                          <>
                            {(() => {
                              const maquina = mockData.equipos.find(
                                (item) =>
                                  String(item.id) === String(paso.maquinaId),
                              );

                              if (!maquina) {
                                return null;
                              }

                              return (
                                <div className="mt-2 flex flex-wrap items-center gap-2 pl-0 text-xs text-muted-foreground sm:pl-12">
                                  <Factory className="size-3" />

                                  <span>
                                    {maquina.nombre}
                                    {" · "}
                                    {maquina.tipo}
                                  </span>

                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "border",
                                      EQUIPO_ESTADO_COLORS[maquina.estado],
                                    )}
                                  >
                                    {EQUIPO_ESTADO_LABELS[maquina.estado]}
                                  </Badge>

                                  {maquina.estado === "disponible" &&
                                    maquina.capacidadActual !== undefined && (
                                      <span className="font-medium text-brand-600">
                                        Capacidad: {maquina.capacidadActual}%
                                      </span>
                                    )}
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!rutaYaConfirmada && (
                  <>
                    <Button
                      className="mt-4 w-full border border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                      onClick={confirmarRuta}
                      disabled={
                        rutaActual.length === 0 ||
                        rutaActual.some((paso) => paso.maquinaId == null)
                      }
                    >
                      <CheckCircle2 className="size-4" />
                      Confirmar planificación
                    </Button>

                    {rutaActual.some((paso) => paso.maquinaId == null) && (
                      <p className="mt-2 text-center text-xs text-amber-600">
                        Asigne una máquina a cada proceso para confirmar
                      </p>
                    )}
                  </>
                )}

                {rutaYaConfirmada && orden.ruta.confirmadaPor && (
                  <p className="mt-3 text-center text-xs font-medium text-brand-600">
                    Ruta confirmada por {orden.ruta.confirmadaPor}
                    {orden.ruta.fechaConfirmacion && (
                      <>
                        {" · "}
                        {formatDate(orden.ruta.fechaConfirmacion)}
                      </>
                    )}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* MATERIA PRIMA                                                    */}
          {/* ---------------------------------------------------------------- */}

          {rutaYaConfirmada && (
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-muted-foreground" />

                    <CardTitle>Materia prima para producción</CardTitle>
                  </div>

                  {!materiasRegistradas && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMateriaModalOpen(true)}
                    >
                      <Plus className="size-3.5" />
                      Agregar
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {materiasActuales.length === 0 ? (
                  <EmptyState
                    title="Sin materia prima registrada"
                    description="Agregue las materias primas necesarias para la producción."
                    icon={<Layers className="size-6" />}
                  />
                ) : (
                  <>
                    <div className="space-y-2">
                      {materiasActuales.map((materia) => (
                        <div
                          key={materia.id}
                          className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-inplaz-100">
                            <Layers className="size-4 text-inplaz-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {materia.nombre}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Lote: {materia.lote}
                              {" · "}
                              Disponible:{" "}
                              {formatNumber(materia.cantidadDisponible)}{" "}
                              {materia.unidad}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm font-bold text-foreground">
                              {formatNumber(materia.cantidadUtilizar)}{" "}
                              {materia.unidad}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              a utilizar
                            </p>
                          </div>

                          {!materiasRegistradas && (
                            <button
                              type="button"
                              onClick={() =>
                                eliminarMateria(Number(materia.id))
                              }
                              className="self-end rounded-lg p-1.5 text-danger-500 transition hover:bg-danger-50 sm:self-auto"
                              aria-label="Eliminar materia prima"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm text-muted-foreground">
                        Materia prima planificada:
                      </span>

                      <span className="text-lg font-bold text-foreground">
                        {formatNumber(totalMateriaPrima)} kg
                      </span>
                    </div>

                    {!materiasRegistradas && materiasPrimas.length > 0 && (
                      <Button
                        className="mt-4 w-full border border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                        onClick={guardarMaterias}
                      >
                        <CheckCircle2 className="size-4" />
                        Guardar materia prima
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* LISTO PARA PRODUCIR                                              */}
          {/* ---------------------------------------------------------------- */}

          {materiasRegistradas &&
            orden.estado !== "en_produccion" &&
            orden.estado !== "completado" && (
              <Card className="border-2 border-brand-300">
                <CardContent className="py-6 text-center">
                  <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-brand-100">
                    <Play className="size-7 text-brand-600" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    Listo para producir
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    La orden tiene ruta confirmada y materia prima registrada.
                  </p>

                  <Button
                    size="lg"
                    className="mt-4 border border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                    onClick={() => setProducirModalOpen(true)}
                  >
                    <Play className="size-5" />
                    Poner a producir
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* MODAL - AGREGAR PROCESO                                             */}
      {/* ================================================================== */}

      <Modal
        open={addProcesoOpen}
        onClose={() => setAddProcesoOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <ModalTitle>Agregar proceso</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-3">
            <Label>Proceso</Label>

            <Select
              value={nuevoProceso}
              onChange={(event) =>
                setNuevoProceso(event.target.value as TipoProceso)
              }
            >
              {PROCESOS_DISPONIBLES.map((proceso) => (
                <option key={proceso} value={proceso}>
                  {PROCESO_LABELS[proceso]}
                </option>
              ))}
            </Select>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="outline" onClick={() => setAddProcesoOpen(false)}>
            Cancelar
          </Button>

          <Button
            className="border border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
            onClick={agregarProceso}
          >
            Agregar
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================================================================== */}
      {/* MODAL - MATERIA PRIMA                                               */}
      {/* ================================================================== */}

      <Modal open={materiaModalOpen} onClose={() => setMateriaModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Agregar materia prima</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            <div>
              <Label>Materia prima</Label>

              <Select
                value={nuevaMateria.id != null ? String(nuevaMateria.id) : ""}
                onChange={(event) => {
                  const found = mockData.materiasPrimasDisponibles.find(
                    (materia) => String(materia.id) === event.target.value,
                  );

                  if (found) {
                    setNuevaMateria({
                      ...found,
                      cantidadUtilizar: 0,
                    });
                  }
                }}
              >
                <option value="">Seleccionar...</option>

                {mockData.materiasPrimasDisponibles.map((materia) => (
                  <option key={materia.id} value={String(materia.id)}>
                    {materia.nombre}
                    {" · Lote "}
                    {materia.lote}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Tipo</Label>

                <Input
                  value={nuevaMateria.tipo ?? ""}
                  onChange={(event) =>
                    setNuevaMateria((current) => ({
                      ...current,
                      tipo: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Lote</Label>

                <Input
                  value={nuevaMateria.lote ?? ""}
                  onChange={(event) =>
                    setNuevaMateria((current) => ({
                      ...current,
                      lote: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Disponible</Label>

                <Input
                  type="number"
                  value={nuevaMateria.cantidadDisponible ?? ""}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div>
                <Label>Cantidad a utilizar</Label>

                <Input
                  type="number"
                  value={nuevaMateria.cantidadUtilizar ?? ""}
                  onChange={(event) =>
                    setNuevaMateria((current) => ({
                      ...current,
                      cantidadUtilizar: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Observaciones</Label>

              <Input
                value={nuevaMateria.observaciones ?? ""}
                onChange={(event) =>
                  setNuevaMateria((current) => ({
                    ...current,
                    observaciones: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="outline" onClick={() => setMateriaModalOpen(false)}>
            Cancelar
          </Button>

          <Button
            className="border border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
            onClick={agregarMateria}
          >
            Agregar
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================================================================== */}
      {/* CONFIRMAR PRODUCCIÓN                                               */}
      {/* ================================================================== */}

      <ConfirmDialog
        open={producirModalOpen}
        onClose={() => setProducirModalOpen(false)}
        onConfirm={ponerAProducir}
        title="¿Deseas poner esta orden en producción?"
        message={`Producto: ${orden.productoNombre} · Cantidad: ${formatNumber(
          orden.cantidad,
        )} un. · Ruta: ${rutaActual
          .map((paso) => PROCESO_LABELS[paso.proceso])
          .join(" → ")} · Máquinas: ${rutaActual
          .map((paso) => paso.maquinaNombre)
          .filter(Boolean)
          .join(", ")} · Materia prima: ${formatNumber(totalMateriaPrima)} kg`}
        confirmLabel="Confirmar producción"
      />
    </div>
  );
}

/**
 * ============================================================================
 * INFO ROW
 * ============================================================================
 */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

/**
 * ============================================================================
 * SPEC ROW
 * ============================================================================
 */

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>

      <span className="text-right text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
