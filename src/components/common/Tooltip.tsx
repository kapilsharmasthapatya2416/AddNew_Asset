"use client";

import { ReactNode, useRef, useState, useId, useEffect, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({
  content,
  children,
  className = "",
  placement = "bottom",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltipId = useId();

  // Show tooltip with calculated position
  const show = (): void => {
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      const positions: Record<string, { top: number; left: number }> = {
        top: { top: rect.top - 8, left: rect.left + rect.width / 2 },
        bottom: { top: rect.bottom + 8, left: rect.left + rect.width / 2 },
        left: { top: rect.top + rect.height / 2, left: rect.left - 8 },
        right: { top: rect.top + rect.height / 2, left: rect.right + 8 },
      };

      setCoords(positions[placement]);
      setVisible(true);
    }, 100);
  };

  // Hide tooltip
  const hide = (): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hasContent: boolean =
    !!content && (typeof content !== "string" || content.trim() !== "");

  const transformMap: Record<string, string> = {
    top: "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2 translate-y-0",
    left: "-translate-x-full -translate-y-1/2",
    right: "translate-x-0 -translate-y-1/2",
  };

  if (!hasContent) return <>{children}</>;

  if (!isValidElement(children)) {
    console.warn("Tooltip children must be a valid React element.");
    return <>{children}</>;
  }

  return (
    <>
      {/* Tooltip Trigger */}
      {cloneElement(children as React.ReactElement<any>, {
        ref: triggerRef,
        onMouseEnter: (e: React.MouseEvent) => {
          show();
          (children as any).props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          hide();
          (children as any).props.onMouseLeave?.(e);
        },
        onFocus: (e: React.FocusEvent) => {
          show();
          (children as any).props.onFocus?.(e);
        },
        onBlur: (e: React.FocusEvent) => {
          hide();
          (children as any).props.onBlur?.(e);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Escape") hide();
          (children as any).props.onKeyDown?.(e);
        },
        "aria-describedby": visible ? tooltipId : undefined,
      })}

      {/* Tooltip Content */}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          aria-live="polite"
          className={cn(
            "fixed z-[9999] whitespace-normal text-center px-4 py-2 min-w-[160px] max-w-[260px] rounded-lg shadow-lg text-xs font-medium pointer-events-none opacity-95",
            "bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 text-white border border-blue-300",
            transformMap[placement],
            className
          )}
          style={{
            top: coords.top,
            left: coords.left,
          }}
        >
          {content}
        </span>
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
