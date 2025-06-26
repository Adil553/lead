"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export enum ErrorVariant {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
}

interface AppError {
  title?: string;
  message: string;
  code?: string;
  timestamp?: string;
  origin?: string; // e.g. "LoginPage", "PaymentModal"
  variant?: ErrorVariant;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<AppError | null>(null);

  const setError = (error: AppError) => {
    setErrorState({
      ...error,
      timestamp: new Date().toISOString(),
    });
    // console.error("[App Error]", error);
  };

  const clearError = () => {
    setErrorState(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
