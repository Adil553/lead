"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlert } from "@/context/alert-context";
import { Button } from "./button";

export function GlobalAlert() {
  const { isOpen, hideAlert, alertOptions } = useAlert();

  if (!alertOptions) return null;

  // Apply default value for showActions
  const {
    title,
    content,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    className,
    showActions = true,
    actions,
  } = alertOptions;

  const handleConfirm = () => {
    onConfirm?.();
    hideAlert();
  };

  const handleCancel = () => {
    onCancel?.();
    hideAlert();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={hideAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={className}>{title}</AlertDialogTitle>
          {content}
          <AlertDialogDescription
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AlertDialogHeader>
        {showActions && (
          <AlertDialogFooter>
            {cancelText && (
              <AlertDialogCancel
                className="hover:text-muted-foreground"
                onClick={handleCancel}
              >
                {cancelText}
              </AlertDialogCancel>
            )}
            {confirmText && (
              <AlertDialogAction onClick={handleConfirm}>
                {confirmText}
              </AlertDialogAction>
            )}
            {actions &&
              actions?.length > 0 &&
              actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={
                    typeof action.variant === "string"
                      ? action.variant
                      : "default"
                  }
                >
                  {action.title}
                </Button>
              ))}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
