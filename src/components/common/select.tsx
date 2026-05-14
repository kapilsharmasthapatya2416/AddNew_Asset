"use client";

import React, { useState, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
 
export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
 
export interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  selectSize?: "sm" | "md";
  disabled?: boolean;
 
  /* Added */
  label?: string;
  required?: boolean;
  error?: string;
}
 
export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  selectSize = "md",
  disabled = false,
  label,
  required,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");
  const selectRef = useRef<HTMLDivElement>(null);
 
  React.useEffect(() => {
    setInternalValue(value || "");
  }, [value]);
 
  const handleSelect = (val: string) => {
    setInternalValue(val);
    setOpen(false);
    onChange?.(val);
  };
 
  const selectedLabel = options.find(
    (opt) => opt.value === internalValue
  )?.label;
 
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
  };
 
  return (
    <div className="flex flex-col gap-1">
 
      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      )}
 
      <div
        ref={selectRef}
        className={cn(
          "relative w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        tabIndex={0}
        onBlur={(e) => {
          const nextTarget = e.relatedTarget;
 
          // If focus leaves the window or there is no related target,
          // close the dropdown safely without calling contains(null).
          if (!nextTarget || !(nextTarget instanceof Node)) {
            setOpen(false);
            return;
          }
 
          if (!selectRef.current?.contains(nextTarget)) {
            setOpen(false);
          }
        }}
      >
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full border text-sm rounded-md bg-white focus:outline-none focus:ring-2 transition-all",
            sizeClasses[selectSize],
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
        >
          <span
            className={cn(
              "truncate text-left flex-1 text-sm",
              !selectedLabel ? "text-gray-400" : "text-gray-800"
            )}
          >
            {selectedLabel || placeholder}
          </span>
 
          <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-400" />
        </button>
 
        {open && (
          <ul
            className="absolute z-50 mt-1 w-full text-gray-800 text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
          >
            {options.map((opt, index) => (
              <li
                key={`${opt.value}-${index}`}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-blue-50",
                  internalValue === opt.value && "bg-blue-100 text-blue-700",
                  opt.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                aria-selected={internalValue === opt.value}
                role="option"
                tabIndex={-1}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
 
      {/* Error Message */}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
