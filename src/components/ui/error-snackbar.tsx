"use client";

import { ErrorVariant, useError } from "@/context/error-context";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from "lucide-react";
import { Button } from "./button";

const variantStyles = {
  [ErrorVariant.Error]: "bg-red-600 text-white",
  [ErrorVariant.Warning]: "bg-yellow-500 text-black",
  [ErrorVariant.Info]: "bg-blue-500 text-white",
  [ErrorVariant.Success]: "bg-green-600 text-white",
};

const variantIcons = {
  [ErrorVariant.Error]: AlertCircle,
  [ErrorVariant.Warning]: AlertTriangle,
  [ErrorVariant.Info]: Info,
  [ErrorVariant.Success]: CheckCircle,
};

export function ErrorSnackbar() {
  const { error, clearError } = useError();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [error, clearError]);

  const handleClose = () => {
    setVisible(false);
    clearError();
  };

  if (!error || !visible) return null;

  const Icon = variantIcons[error.variant || ErrorVariant.Error];

  return (
    <div className="z-50 w-full  px-2">
      <div
        className={clsx(
          "flex items-center justify-between gap-4 p-4 rounded-md shadow-lg transition-all duration-300",
          variantStyles[error.variant || ErrorVariant.Error]
        )}
      >
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-grow">
          {error.title && (
            <strong className="block font-medium">{error.title}</strong>
          )}
          <span dangerouslySetInnerHTML={{ __html: error.message }} />
          {error.actions && (
            <div className="flex gap-2">
              {error.actions.map((action) => (
                <Button key={action.label} onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 -mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
