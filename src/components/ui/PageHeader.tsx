import type { HTMLAttributes, ReactNode } from "react";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface PageHeaderProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
}

function PageHeader({
  title,
  description,
  breadcrumb = [],
  actions,
  className = "",
  ...props
}: PageHeaderProps) {
  const classes = ["flex flex-col gap-4", className].filter(Boolean).join(" ");

  return (
    <header className={classes} {...props}>
      {breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <li key={index} className="flex min-w-0 items-center gap-1.5">
                  {index > 0 && <span aria-hidden="true">/</span>}

                  {item.href && !isLast ? (
                    <a
                      href={item.href}
                      className="truncate hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className="truncate"
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
