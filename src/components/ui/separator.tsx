"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  label?: string;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  label,
  ...props
}: SeparatorProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("relative my-4 text-center text-sm", className)}>
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation={orientation}
          className="absolute inset-0 top-1/2 -translate-y-1/2 bg-border h-px w-full"
          {...props}
        />
        <span className="relative z-10 px-2 bg-card text-muted-foreground">
          {label}
        </span>
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
