"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type ActionButton = {
  title: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

interface AlertOptions {
  title: string;
  content?: ReactNode;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  showActions?: boolean;
  actions?: ActionButton[];
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
  isOpen: boolean;
  alertOptions: AlertOptions | null;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
    setAlertOptions(null);
  };

  return (
    <AlertContext.Provider
      value={{ showAlert, hideAlert, isOpen, alertOptions }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
