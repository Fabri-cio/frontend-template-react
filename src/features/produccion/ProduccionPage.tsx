import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  Clock,
  Factory,
  Layers,
  ShieldCheck,
} from "lucide-react";
import type { DropResult } from "@hello-pangea/dnd";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingState,
  PageHeader,
} from "../../components/ui";

import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
} from "../../components/ui/kanban";

import { cn } from "../../lib/cn";

import {
  ORDEN_ESTADO_LABELS,
  PRIORIDAD_DOTS,
  PRIORIDAD_LABELS,
  PRODUCCION_ESTADO_COLORS,
  PRODUCCION_ESTADO_LABELS,
  PRODUCCION_ESTADOS,
  PRODUCCION_TEXTS,
} from "./produccion.constants";

import { createProduccionMockData } from "./produccion.mock";

import type {
  OrdenProduccionMock,
  ProduccionKanbanEstado,
  ProduccionKanbanItemMock,
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

function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * ============================================================================
 * ESTILOS CORPORATIVOS DE PRODUCCIÓN
 * ============================================================================
 *
 * Estos estilos utilizan las paletas fijas definidas en globals.css.
 *
 * No utilizamos `primary` aquí porque `primary` pertenece al sistema
 * semántico general y puede cambiar mediante `data-color`.
 *
 * Producción conserva:
 *
 * - brand = verde corporativo
 * - inplaz = azul corporativo
 * - danger = rojo corporativo
 */

/**
 * Solicitudes viables:
 *
 * Prioridades y estados solicitables utilizan el mismo tratamiento visual
 * verde que Pendiente.
 */
const SOLICITUD_GREEN_CLASS = "border-brand-200 bg-brand-50 text-brand-700";

/**
 * Botones Planificar / Continuar.
 */
const SOLICITUD_ACTION_CLASS =
  "border border-brand-600 bg-brand-600 text-white hover:border-brand-700 hover:bg-brand-700";

/**
 * ============================================================================
 * PRODUCCION PAGE
 * ============================================================================
 */

export default function ProduccionPage() {
  const navigate = useNavigate();

  /**
   * --------------------------------------------------------------------------
   * Mock
   * --------------------------------------------------------------------------
   */

  const [mockData] = useState(() => createProduccionMockData());

  /**
   * --------------------------------------------------------------------------
   * Estado visual del Kanban
   * --------------------------------------------------------------------------
   */

  const [operaciones, setOperaciones] = useState<ProduccionKanbanItemMock[]>(
    () => [...mockData.operaciones],
  );

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
   */

  const [showViables, setShowViables] = useState(true);

  /**
   * --------------------------------------------------------------------------
   * Solicitudes viables
   * --------------------------------------------------------------------------
   */

  const solicitudesPendientes = useMemo(() => {
    return mockData.ordenes.filter(
      (orden) =>
        orden.estado === "viable" ||
        orden.estado === "en_planificacion" ||
        orden.estado === "ruta_confirmada" ||
        orden.estado === "materia_prima_lista",
    );
  }, [mockData.ordenes]);

  /**
   * --------------------------------------------------------------------------
   * Buscar orden por pedido
   * --------------------------------------------------------------------------
   */

  const getOrdenByPedido = (pedidoId: number) => {
    return mockData.ordenes.find((orden) => orden.pedidoId === pedidoId);
  };

  /**
   * --------------------------------------------------------------------------
   * Drag & Drop
   * --------------------------------------------------------------------------
   */

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceColumn = result.source.droppableId as ProduccionKanbanEstado;

    const destinationColumn = result.destination
      .droppableId as ProduccionKanbanEstado;

    if (sourceColumn === destinationColumn) {
      return;
    }

    setOperaciones((current) =>
      current.map((item) =>
        item.id === result.draggableId
          ? {
              ...item,
              estado: destinationColumn,
            }
          : item,
      ),
    );
  };

  /**
   * --------------------------------------------------------------------------
   * Loading
   * --------------------------------------------------------------------------
   */

  const isLoading = false;

  if (isLoading) {
    return (
      <LoadingState message="Cargando producción..." className="min-h-64" />
    );
  }

  return (
    <div className="font-inter">
      <PageHeader
        title={PRODUCCION_TEXTS.pageTitle}
        description={PRODUCCION_TEXTS.pageDescription}
        breadcrumb={[
          {
            label: PRODUCCION_TEXTS.pageTitle,
          },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* ================================================================== */}
        {/* SOLICITUDES VIABLES                                                */}
        {/* ================================================================== */}

        {solicitudesPendientes.length > 0 && (
          <Card className="border-2 border-brand-200 shadow-card">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <ShieldCheck
                    className="size-4 shrink-0 text-brand-600"
                    aria-hidden="true"
                  />

                  <CardTitle className="truncate">
                    {PRODUCCION_TEXTS.viableTitle}
                  </CardTitle>

                  <Badge
                    variant="outline"
                    className="shrink-0 border-brand-300 bg-brand-100 text-brand-700"
                  >
                    {solicitudesPendientes.length}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => setShowViables((current) => !current)}
                  className="self-start text-xs text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
                >
                  {showViables ? PRODUCCION_TEXTS.hide : PRODUCCION_TEXTS.show}
                </button>
              </div>
            </CardHeader>

            {showViables && (
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {solicitudesPendientes.map((orden) => (
                    <SolicitudViableRow
                      key={orden.id}
                      orden={orden}
                      onOpen={() =>
                        navigate(`/produccion/planificacion/${orden.id}`)
                      }
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* ================================================================== */}
        {/* KANBAN                                                            */}
        {/* ================================================================== */}

        <KanbanBoard onDragEnd={handleDragEnd}>
          {PRODUCCION_ESTADOS.map((estado) => {
            const estadoItems = operaciones.filter(
              (item) => item.estado === estado,
            );

            return (
              <KanbanColumn
                key={estado}
                id={estado}
                count={estadoItems.length}
                emptyMessage={PRODUCCION_TEXTS.noProduction}
                title={
                  <Badge
                    variant="outline"
                    className={cn("border", PRODUCCION_ESTADO_COLORS[estado])}
                  >
                    {PRODUCCION_ESTADO_LABELS[estado]}
                  </Badge>
                }
              >
                {estadoItems.map((item, index) => {
                  const orden = getOrdenByPedido(item.pedidoId);

                  return (
                    <KanbanCard key={item.id} id={item.id} index={index}>
                      <ProduccionKanbanCard
                        item={item}
                        orden={orden}
                        onOpen={() => {
                          if (!orden) {
                            return;
                          }

                          navigate(`/produccion/orden/${orden.id}`);
                        }}
                      />
                    </KanbanCard>
                  );
                })}
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * SOLICITUD VIABLE
 * ============================================================================
 */

interface SolicitudViableRowProps {
  orden: OrdenProduccionMock;
  onOpen: () => void;
}

function SolicitudViableRow({ orden, onOpen }: SolicitudViableRowProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4">
      {/* ------------------------------------------------------------------ */}
      {/* Icono                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
        <ClipboardCheck className="size-5" aria-hidden="true" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Información                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {orden.pedidoNumero}
          </span>

          <Badge
            variant="outline"
            className={cn("border", SOLICITUD_GREEN_CLASS)}
          >
            <span
              className="mr-1.5 size-1.5 rounded-full bg-brand-500"
              aria-hidden="true"
            />

            {PRIORIDAD_LABELS[orden.prioridad]}
          </Badge>
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {orden.clienteNombre}
          {" · "}
          {orden.productoNombre}
          {" · "}
          {formatNumber(orden.cantidad)} un.
          {" · "}
          Entrega: {formatDateShort(orden.fechaRequerida)}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Estado                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Badge
        variant="outline"
        className={cn("self-start border sm:self-auto", SOLICITUD_GREEN_CLASS)}
      >
        {ORDEN_ESTADO_LABELS[orden.estado]}
      </Badge>

      {/* ------------------------------------------------------------------ */}
      {/* Acción                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Button
        size="sm"
        className={cn("self-stretch sm:self-auto", SOLICITUD_ACTION_CLASS)}
        onClick={onOpen}
      >
        {orden.estado === "viable" ? "Planificar" : "Continuar"}

        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * ============================================================================
 * KANBAN CARD
 * ============================================================================
 */

interface ProduccionKanbanCardProps {
  item: ProduccionKanbanItemMock;
  orden?: OrdenProduccionMock;
  onOpen: () => void;
}

function ProduccionKanbanCard({
  item,
  orden,
  onOpen,
}: ProduccionKanbanCardProps) {
  const progress =
    item.cantidad > 0
      ? Math.min(100, Math.round((item.producido / item.cantidad) * 100))
      : 0;

  const isComplete = item.producido >= item.cantidad && item.cantidad > 0;

  /**
   * En la sección Kanban mantenemos la identidad legacy:
   *
   * - completada: verde brand
   * - en proceso: azul INPLAZ
   *
   * No usamos `primary` porque podría cambiar por data-color.
   */
  const progressBarClass = isComplete ? "bg-brand-500" : "bg-inplaz-500";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="space-y-2 outline-none focus-visible:ring-2 focus-visible:ring-inplaz-500 focus-visible:ring-offset-2"
      aria-label={`Abrir orden ${item.pedidoNumero}`}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Pedido + prioridad                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-foreground">
          {item.pedidoNumero}
        </span>

        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            PRIORIDAD_DOTS[item.prioridad],
          )}
          title={`Prioridad: ${PRIORIDAD_LABELS[item.prioridad]}`}
          aria-label={`Prioridad ${PRIORIDAD_LABELS[item.prioridad]}`}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Máquina                                                          */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Factory className="size-3.5 shrink-0" aria-hidden="true" />

        <span className="truncate">{item.maquinaNombre || "Por asignar"}</span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Progress                                                         */}
      {/* ---------------------------------------------------------------- */}

      <div className="w-full">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progressBarClass,
            )}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatNumber(item.producido)}
          {" / "}
          {formatNumber(item.cantidad)}
        </span>

        <span>{progress}%</span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Tiempo                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3 shrink-0" aria-hidden="true" />

        <span>
          {item.tiempoTranscurrido}
          {" / "}
          {item.tiempoEstimado}
        </span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Operador                                                         */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center gap-1.5 border-t border-border pt-2">
        <Avatar name={item.operador} size="sm" />

        <span className="truncate text-xs text-muted-foreground">
          {item.operador}
        </span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Ruta                                                             */}
      {/* ---------------------------------------------------------------- */}

      {orden && item.ruta.length > 0 && (
        <div className="border-t border-border pt-2">
          <div className="flex items-start gap-1 text-xs font-medium text-inplaz-600">
            <Layers className="mt-0.5 size-3 shrink-0" aria-hidden="true" />

            <span className="line-clamp-2">{item.ruta.join(" → ")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
