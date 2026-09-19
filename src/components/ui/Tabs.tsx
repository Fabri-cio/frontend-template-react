import type { KeyboardEvent, ReactNode } from "react";

export interface TabItem<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  value: T;
  items: TabItem<T>[];
  onChange: (value: T) => void;
  className?: string;
}

function Tabs<T extends string = string>({
  value,
  items,
  onChange,
  className = "",
}: TabsProps<T>) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const enabledItems = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled);

    if (enabledItems.length === 0) {
      return;
    }

    const currentEnabledIndex = enabledItems.findIndex(
      ({ index }) => index === currentIndex,
    );

    if (currentEnabledIndex === -1) {
      return;
    }

    let nextEnabledIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextEnabledIndex = (currentEnabledIndex + 1) % enabledItems.length;
        break;

      case "ArrowLeft":
        nextEnabledIndex =
          (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length;
        break;

      case "Home":
        nextEnabledIndex = 0;
        break;

      case "End":
        nextEnabledIndex = enabledItems.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    onChange(enabledItems[nextEnabledIndex].item.value);
  };

  const classes = [
    "flex items-center gap-1 overflow-x-auto border-b border-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="tablist" aria-orientation="horizontal">
      {items.map((item, index) => {
        const isActive = item.value === value;

        const tabClasses = [
          "relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2.5",
          "text-sm font-medium",
          "border-b-2",
          "transition-colors",
          "focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${item.value}`}
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            className={tabClasses}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>{item.label}</span>

            {item.count !== undefined && (
              <span
                className={[
                  "inline-flex min-w-5 items-center justify-center",
                  "rounded-full px-1.5 py-0.5",
                  "text-xs font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                ].join(" ")}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
