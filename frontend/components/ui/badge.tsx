import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
