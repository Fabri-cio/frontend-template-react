import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export type TableSize = "default" | "compact";

export type TableAlign = "left" | "center" | "right";

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  size?: TableSize;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
  size?: TableSize;
  sticky?: boolean;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
  size?: TableSize;
}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

const sizeClasses: Record<TableSize, string> = {
  default: "px-4 py-3",
  compact: "px-3 py-2",
};

const alignClasses: Record<TableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Primitive base para tablas.
 *
 * No contiene lógica de negocio ni depende de una feature.
 * Puede utilizarse directamente o como base de DataTable.
 */
function Table({
  size = "default",
  striped = false,
  hoverable = true,
  stickyHeader = false,
  className = "",
  children,
  ...props
}: TableProps) {
  const classes = ["w-full border-collapse text-sm", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[
        "w-full overflow-x-auto",
        stickyHeader ? "max-h-[32rem] overflow-y-auto" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <table className={classes} data-size={size}>
        {children}
      </table>
    </div>
  );
}

function TableHeader({ className = "", ...props }: TableHeaderProps) {
  const classes = ["border-b border-border", "bg-muted/50", className]
    .filter(Boolean)
    .join(" ");

  return <thead className={classes} {...props} />;
}

function TableBody({ className = "", ...props }: TableBodyProps) {
  const classes = ["[&_tr:last-child]:border-0", className]
    .filter(Boolean)
    .join(" ");

  return <tbody className={classes} {...props} />;
}

function TableFooter({ className = "", ...props }: TableFooterProps) {
  const classes = ["border-t border-border", "bg-muted/30", className]
    .filter(Boolean)
    .join(" ");

  return <tfoot className={classes} {...props} />;
}

function TableRow({
  selected = false,
  striped = false,
  hoverable = false,
  className = "",
  ...props
}: TableRowProps) {
  const classes = [
    "border-b border-border",
    "transition-colors",
    striped ? "even:bg-muted/30" : "",
    hoverable ? "hover:bg-muted/50" : "",
    selected ? "bg-primary/10" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={classes} data-selected={selected || undefined} {...props} />
  );
}

function TableHead({
  align = "left",
  size = "default",
  sticky = false,
  className = "",
  ...props
}: TableHeadProps) {
  const classes = [
    "font-semibold text-foreground",
    "whitespace-nowrap",
    sizeClasses[size],
    alignClasses[align],
    sticky ? "sticky top-0 z-10 bg-muted/50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <th scope="col" className={classes} {...props} />;
}

function TableCell({
  align = "left",
  size = "default",
  className = "",
  ...props
}: TableCellProps) {
  const classes = [
    "text-foreground",
    "whitespace-nowrap",
    sizeClasses[size],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <td className={classes} {...props} />;
}

function TableCaption({ className = "", ...props }: TableCaptionProps) {
  const classes = ["mt-3 text-left text-sm text-muted-foreground", className]
    .filter(Boolean)
    .join(" ");

  return <caption className={classes} {...props} />;
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

export default Table;
