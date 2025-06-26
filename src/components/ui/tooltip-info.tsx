// components/ReusableTooltip.tsx (or similar path)
import React from "react";
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * Defines the props interface for the ReusableTooltip component.
 */
interface ReusableTooltipProps {
  /**
   * The content that triggers the tooltip (e.g., a button, text, icon).
   */
  trigger: React.ReactNode;
  /**
   * The content to be displayed inside the tooltip.
   */
  content: React.ReactNode;
  /**
   * The side where the tooltip content will appear relative to the trigger.
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * The alignment of the tooltip content relative to the trigger.
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * Additional class names for the TooltipContent.
   * @default "max-w-xs whitespace-normal"
   */
  className?: string;
  /**
   * The delay in milliseconds before the tooltip opens.
   * @default 0
   */
  delayDuration?: number;
}

/**
 * A reusable Tooltip component that wraps the shadcn/ui (or similar) Tooltip components.
 */
const ReusableTooltip: React.FC<ReusableTooltipProps> = ({
  trigger,
  content,
  side = "top",
  align = "center",
  className = "max-w-xs whitespace-normal",
  delayDuration = 0,
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReusableTooltip;
