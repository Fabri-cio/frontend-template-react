import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function Textarea({
  error = false,
  className = "",
  ...props
}: TextareaProps) {
  const classes = [
    "min-h-24 w-full resize-y rounded-md border border-border bg-background px-3 py-2",
    "text-sm text-foreground",
    "placeholder:text-muted-foreground",
    "outline-none",
    "transition-colors",
    "focus:border-primary",
    "focus:ring-2",
    "focus:ring-primary/20",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "read-only:bg-muted",
    error
      ? [
          "border-destructive",
          "focus:border-destructive",
          "focus:ring-destructive/20",
        ].join(" ")
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <textarea
      className={classes}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export default Textarea;