import type { HTMLAttributes } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {}

function PageContainer({ className = "", ...props }: PageContainerProps) {
  const classes = ["container", className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}

export default PageContainer;
