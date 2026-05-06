"use client";
import React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  Share,
  Save,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  RefreshCw,
  Check,
  Eraser,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  ClipboardCopy
} from "lucide-react";
import { Button, type ButtonProps } from "./ActionButton";
import { cn } from "@/lib/utils/cn";

/* ----------------------------------------------------------
   SHARED PROPS
---------------------------------------------------------- */

export type LabeledActionButtonProps = Omit<
  ButtonProps,
  "icon" | "variant"
> & {
  label?: string;
};

export type IconOnlyButtonProps = Omit<
  ButtonProps,
  "children" | "icon"
> & {
  icon: React.ElementType;
  variant?: "primary" | "danger";
};

export type PageNumberButtonProps = {
  page: number;
  active?: boolean;
  onClick?: () => void;
};

// TabButton: for tab-like navigation with icon and label
export interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}
/* ----------------------------------------------------------
   LABELED ACTION BUTTONS
---------------------------------------------------------- */

export function AddButton({
  label = "Add",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="primary" icon={Plus} {...props}>
      {label}
    </Button>
  );
}
export function UpdateButton({
  label = "Update",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="primary" icon={RefreshCw} {...props}>
      {label}
    </Button>
  );
}

export function ApplyButton({
  label = "Apply",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="success" icon={Check} {...props}>
      {label}
    </Button>
  );
}
export function ClearButton({
  label = "Clear",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="secondary" icon={Eraser} {...props}>
      {label}
    </Button>
  );
}
export function SaveButton({
  label = "Save",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="success" icon={Save} {...props}>
      {label}
    </Button>
  );
}

export function CancelButton({
  label = "Cancel",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="secondary" icon={X} {...props}>
      {label}
    </Button>
  );
}

export function UploadButton({
  label = "Upload",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="primary" icon={Upload} {...props}>
      {label}
    </Button>
  );
}

export function ExportButton({
  label = "Export",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="secondary" icon={Share} {...props}>
      {label}
    </Button>
  );
}

export function ImportButton({
  label = "Import",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="secondary" icon={Download} {...props}>
      {label}
    </Button>
  );
}

export function DownloadButton({
  label = "Download",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="secondary" icon={Download} {...props}>
      {label}
    </Button>
  );
}


export function EditLabelButton({
  label = "Edit",
  size = "sm",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="edit" icon={Pencil} size={size} {...props}>
      {label}
    </Button>
  );
}

export function DeleteLabelButton({
  label = "Delete",
  size = "sm",
  ...props
}: LabeledActionButtonProps): React.ReactElement {
  return (
    <Button variant="delete" icon={Trash2} size={size} {...props}>
      {label}
    </Button>
  );
}
/* ----------------------------------------------------------
   ICON-ONLY CRUD BUTTONS
---------------------------------------------------------- */

export function EditButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="edit"
      icon={Pencil}
      size="sm"
      aria-label={ariaLabel ?? "Edit"}
      {...props}
    />
  );
}

export function DeleteButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="delete"
      icon={Trash2}
      size="sm"
      aria-label={ariaLabel ?? "Delete"}
      {...props}
    />
  );
}

export function MultiplierButton({
  title,
  disabled,
  onClick,
  className = "",
}: {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title || "Use Group Multipliers"}
      disabled={disabled}
      className={`w-9 h-9 bg-blue-600 border-blue-600 text-blue-100 transition-all duration-200 rounded-full flex items-center justify-center text-base ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400 hover:text-white hover:scale-105 active:scale-95'} ${className}`}
      onClick={onClick}
    >
      <TrendingUp size={16} />
    </button>
  );
}

export function GenerateMatrixButton({
  title,
  disabled,
  onClick,
  className = "",
}: {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title || "Generate Rate Matrix"}
      disabled={disabled}
      className={`w-9 h-9 bg-blue-600 border-blue-600 text-blue-100 transition-all duration-200 rounded-full flex items-center justify-center text-base ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400 hover:text-white hover:scale-105 active:scale-95'} ${className}`}
      onClick={onClick}
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export function CopyRatesButton({
  title,
  disabled,
  onClick,
  className = "",
}: {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title || "Copy Rates"}
      disabled={disabled}
      className={`w-9 h-9 bg-blue-600 border-blue-600 text-blue-100 transition-all duration-200 rounded-full flex items-center justify-center text-base ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400 hover:text-white hover:scale-105 active:scale-95'} ${className}`}
      onClick={onClick}
    >
      <ClipboardCopy size={16} />
    </button>
  );
}

export function CloseIconButton({
  title = "Close",
  onClick,
  className = "",
  size = 18,
}: {
  title?: string;
  onClick?: () => void;
  className?: string;
  size?: number;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 shadow-sm ${className}`}
      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10 }}
    >
      <X size={size} />
    </button>
  );
}
/* ----------------------------------------------------------
   PAGINATION BUTTONS
---------------------------------------------------------- */

export function FirstPageButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="secondary"
      icon={ChevronsLeft}
      size="sm"
      aria-label={ariaLabel ?? "Go to first page"}
      {...props}
    />
  );
}

export function PrevPageButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="secondary"
      icon={ChevronLeft}
      size="sm"
      aria-label={ariaLabel ?? "Go to previous page"}
      {...props}
    />
  );
}

export function NextPageButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="secondary"
      icon={ChevronRight}
      size="sm"
      aria-label={ariaLabel ?? "Go to next page"}
      {...props}
    />
  );
}

export function LastPageButton(
  { ["aria-label"]: ariaLabel, ...props }: Omit<ButtonProps, "icon" | "variant">
): React.ReactElement {
  return (
    <Button
      variant="secondary"
      icon={ChevronsRight}
      size="sm"
      aria-label={ariaLabel ?? "Go to last page"}
      {...props}
    />
  );
}
/* ----------------------------------------------------------
   ICON-ONLY FANCY BUTTON
---------------------------------------------------------- */

export function IconButton({
  icon: Icon,
  variant = "primary",
  className = "",
  ...props
}: IconOnlyButtonProps): React.ReactElement {
  const gradientClass =
    variant === "danger"
      ? "bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 hover:shadow-red-300/50"
      : "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:shadow-cyan-300/50";

  return (
    <button
      className={cn(
        "group relative h-8 w-8 rounded-lg inline-flex items-center justify-center text-white overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50",
        gradientClass,
        className
      )}
      {...props}
    >
      <Icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
    </button>
  );
}

/* ----------------------------------------------------------
   PAGE NUMBER BUTTON
---------------------------------------------------------- */

export function PageNumberButton({
  page,
  active = false,
  onClick,
}: PageNumberButtonProps): React.ReactElement {
  return (
    <Button
      size="sm"
      onClick={onClick}
      variant={active ? "primary" : "secondary"}
      className={cn(
        "min-w-[36px] px-3 text-sm font-medium",
        active
          ? "bg-[#2563EB] text-white border border-[#2563EB]"
          : "bg-white border border-[#DCEAFF] text-[#1E3A8A] hover:bg-gray-50"
      )}
      aria-label={`Go to page ${page}`}
    >
      {page}
    </Button>
  );
}

/* ----------------------------------------------------------
   ICON-ONLY SORT BUTTONS
---------------------------------------------------------- */

export function SortAscButton(
  { ["aria-label"]: ariaLabel, className = "", ...props }: Omit<ButtonProps, "icon" | "variant" | "children">
): React.ReactElement {
  return (
    <Button
      variant="ghost"
      icon={ArrowUp}
      size="sm"
      aria-label={ariaLabel ?? "Sort ascending"}
      className={cn("hover:bg-transparent hover:text-blue-600 focus:!ring-0 focus:!ring-offset-0", className)}
      {...props}
    />
  );
}

export function SortDescButton(
  { ["aria-label"]: ariaLabel, className = "", ...props }: Omit<ButtonProps, "icon" | "variant" | "children">
): React.ReactElement {
  return (
    <Button
      variant="ghost"
      icon={ArrowDown}
      size="sm"
      aria-label={ariaLabel ?? "Sort descending"}
      className={cn("hover:bg-transparent hover:text-blue-600 focus:!ring-0 focus:!ring-offset-0", className)}
      {...props}
    />
  );
}

export function SortDefaultButton(
  { ["aria-label"]: ariaLabel, className = "", ...props }: Omit<ButtonProps, "icon" | "variant" | "children">
): React.ReactElement {
  return (
    <Button
      variant="ghost"
      icon={ArrowUpDown}
      size="sm"
      aria-label={ariaLabel ?? "Sort"}
      className={cn("hover:bg-transparent hover:text-blue-600 focus:!ring-0 focus:!ring-offset-0", className)}
      {...props}
    />
  );
}

//Tab like button with icon and label, used for navigation between sections
export function TabButton({ icon: Icon, label, active, className = "", ...props }: TabButtonProps) {
  return (
    <button
      type="button"
      className={
        `w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-all ` +
        (active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        ) +
        ` ${className}`
      }
      {...props}
    >
      <Icon size={18} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}