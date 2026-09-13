import { forwardRef, type HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  function PageContainer({ className = "", ...props }, ref) {
    const classes = ["container", className].filter(Boolean).join(" ");

    return <div ref={ref} className={classes} {...props} />;
  },
);

export default PageContainer;
