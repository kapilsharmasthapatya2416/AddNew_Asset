"use client";

import React from "react";
import { Save, X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button, ButtonProps } from "./Button";

type ActionButtonVariant = "save" | "cancel" | "add" | "update" | "primary" | "secondary" | "edit" | "delete";

interface ActionButtonProps extends Omit<ButtonProps, "variant" | "icon"> {
  variant: ActionButtonVariant;
  label?: string;
  loadingLabel?: string;
  isLoading?: boolean;
}

/**
 * ActionButton - A wrapper around Button for common form actions
 * Automatically maps action variants to the appropriate Button variant and icon
 */
export function ActionButton({
  variant,
  label,
  loadingLabel,
  isLoading = false,
  children,
  ...props
}: ActionButtonProps) {
  // Map action variants to Button variants and icons
  const variantMapping: Record<
    ActionButtonVariant,
    { buttonVariant: ButtonProps["variant"]; icon?: React.ElementType }
  > = {
    save: { buttonVariant: "success", icon: Save },
    update: { buttonVariant: "success", icon: Save },
    cancel: { buttonVariant: "secondary", icon: X },
    add: { buttonVariant: "primary", icon: Plus },
    edit: { buttonVariant: "ghost", icon: Pencil },
    delete: { buttonVariant: "ghost", icon: Trash2 },
    primary: { buttonVariant: "primary" },
    secondary: { buttonVariant: "secondary" },
  };

  const { buttonVariant, icon } = variantMapping[variant] || variantMapping.primary;

  return (
    <Button
      variant={buttonVariant}
      icon={icon}
      isLoading={isLoading}
      {...props}
    >
      {isLoading && loadingLabel ? loadingLabel : (label || children)}
    </Button>
  );
}
