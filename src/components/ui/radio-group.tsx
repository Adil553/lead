"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        `relative flex items-center justify-center
         size-5 rounded-full border-2 border-muted-foreground
         bg-background shadow-sm
         transition-colors duration-200
         focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
         hover:border-primary
         data-[state=checked]:border-[5px]
         data-[state=checked]:border-primary
         data-[state=checked]:bg-primary/10
         data-[state=checked]:animate-radio-bounce
         disabled:opacity-50 disabled:cursor-not-allowed`,
        className
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
