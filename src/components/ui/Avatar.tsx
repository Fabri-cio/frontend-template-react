import type { ImgHTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt"
> {
  name?: string;
  alt?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

function getInitials(name?: string) {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function Avatar({
  name,
  alt,
  size = "md",
  className = "",
  src,
  onError,
  ...props
}: AvatarProps) {
  const [firstName, ...remainingNames] = name?.trim().split(/\s+/) ?? [];
  const fallbackName =
    firstName && remainingNames.length > 0
      ? `${firstName} ${remainingNames.join(" ")}`
      : name;

  const classes = [
    "inline-flex shrink-0 items-center justify-center overflow-hidden",
    "rounded-full bg-secondary text-secondary-foreground",
    "font-medium select-none",
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = "none";
    onError?.(event);
  };

  if (!src) {
    return (
      <span
        className={classes}
        role={alt ? undefined : "img"}
        aria-label={alt ?? fallbackName ?? undefined}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <span className={classes}>
      <img
        src={src}
        alt={alt ?? name ?? ""}
        className="size-full object-cover"
        onError={handleError}
        {...props}
      />

      <span
        className="hidden size-full items-center justify-center"
        aria-hidden="true"
      >
        {getInitials(name)}
      </span>
    </span>
  );
}

export default Avatar;
