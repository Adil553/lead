import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  className?: string;
  text?: string;
  showSpinner?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  className,
  text,
  showSpinner = true,
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/60 overflow-auto",
        className
      )}
    >
      <div className="flex flex-col items-center p-4">
        {showSpinner && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        )}
        {text && <span className="mt-3 text-xs">{text}</span>}
      </div>
    </div>
  );
};

export default Spinner;
