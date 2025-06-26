"use client";

import { cn } from "@/lib/utils";
import { COLLAPSIBLE_REF } from "@/utils/types";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { ReactNode, useImperativeHandle } from "react";

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

/**
 * 🧩 Reusable Collapsible Card component (Demo Style)
 */
function CollapsibleCard({
  children,
  header,
  helperText,
  showHelperText = true,
  initialOpen = false,
  isCollapsible = true,
  className,
  ref,
}: {
  children: ReactNode;
  header?: ReactNode;
  helperText?: string;
  showHelperText?: boolean;
  initialOpen?: boolean;
  isCollapsible?: boolean;
  ref?: React.RefObject<COLLAPSIBLE_REF>;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  useImperativeHandle(ref, () => ({
    isOpen,
    setIsOpen,
  }));

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={isCollapsible ? setIsOpen : undefined}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border p-2 shadow-sm",
        className
      )}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        {header}
        {isCollapsible && (
          <div className="flex items-center gap-2">
            {showHelperText && (
              <span className="text-sm text-muted-foreground">
                {helperText
                  ? helperText
                  : !isOpen
                  ? "Show details"
                  : "Hide details"}
              </span>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        )}
      </CollapsibleTrigger>
      {children && (
        <CollapsibleContent className="space-y-2 bg-card">
          {children}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

export { Collapsible, CollapsibleCard, CollapsibleContent, CollapsibleTrigger };
