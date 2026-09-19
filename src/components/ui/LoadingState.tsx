import type { HTMLAttributes, ReactNode } from "react";

import Spinner from "./Spinner";

export interface LoadingStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  message?: ReactNode;
  size?: "sm" | "md" | "lg";
}

function LoadingState({
  message,
  size = "md",
  className = "",
  ...props
}: LoadingStateProps) {
  const classes = [
    "flex min-h-24 flex-col items-center justify-center gap-3",
    "text-sm text-muted-foreground",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-live="polite" className={classes} {...props}>
      <Spinner size={size} />

      {message && <span>{message}</span>}
    </div>
  );
}

export default LoadingState;
