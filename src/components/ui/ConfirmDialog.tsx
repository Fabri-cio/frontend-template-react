import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import Button from "./Button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./Modal";

/**
 * ============================================================================
 * ConfirmDialog
 * ============================================================================
 *
 * Diálogo genérico de confirmación.
 *
 * Internamente reutiliza:
 * - Modal
 * - Button
 *
 * No conoce ningún dominio de la aplicación.
 *
 * Ejemplo:
 *
 * <ConfirmDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleConfirm}
 *   title="Eliminar registro"
 *   message="¿Deseas eliminar este registro?"
 * />
 */

export interface ConfirmDialogProps {
  /** Controla la visibilidad del diálogo. */
  open: boolean;

  /** Cierra el diálogo sin ejecutar la acción principal. */
  onClose: () => void;

  /** Ejecuta la acción de confirmación. */
  onConfirm: () => void | Promise<void>;

  /** Título del diálogo. */
  title: ReactNode;

  /** Mensaje mostrado cuando no se proporciona `children`. */
  message: ReactNode;

  /** Texto del botón secundario. */
  cancelLabel?: ReactNode;

  /** Texto del botón principal. */
  confirmLabel?: ReactNode;

  /** Variante visual del botón principal. */
  confirmVariant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline";

  /** Indica que la operación está siendo procesada. */
  loading?: boolean;

  /**
   * Permite reemplazar el mensaje por contenido personalizado.
   *
   * Es útil para confirmaciones que necesitan mostrar
   * información adicional antes de confirmar.
   */
  children?: ReactNode;
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  confirmVariant = "primary",
  loading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader>
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex size-10 shrink-0 items-center justify-center",
              "rounded-full bg-warning/10 text-warning",
            ].join(" ")}
            aria-hidden="true"
          >
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0">
            <ModalTitle>{title}</ModalTitle>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        {children ?? (
          <p className="text-sm leading-6 text-muted-foreground">{message}</p>
        )}
      </ModalContent>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>

        <Button
          type="button"
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ConfirmDialog;
