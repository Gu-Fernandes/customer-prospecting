"use client";

import * as React from "react";
import { cn } from "@/libs/cn";
import { icons } from "@/components/icons";

type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";
type IconKey = keyof typeof icons;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: IconKey | React.ReactNode;
  iconPosition?: "left" | "right" | "only";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      className,
      disabled,
      children,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      rounded-lg text-sm font-medium shadow-sm outline-none
      transition-colors disabled:cursor-not-allowed disabled:opacity-50
    `;

    const variants: Record<ButtonVariant, string> = {
      default: `bg-primary text-white hover:bg-primary/80 border border-primary`,
      destructive: `bg-red-600 text-white hover:bg-red-500 focus:ring-red-500`,
      outline: `bg-transparent text-foreground border border-primary hover:bg-primary hover:text-white`,
      ghost: `bg-transparent text-foreground`,
      icon: `bg-transparent text-foreground`,
    };

    const sizeMap = {
      sm: { pad: "px-2 py-1", sq: "h-7 w-7", icon: "h-3.5 w-3.5" },
      md: { pad: "px-4 py-2", sq: "h-9 w-9", icon: "h-4 w-4" },
      lg: { pad: "px-5 py-2.5", sq: "h-10 w-10", icon: "h-5 w-5" },
    } as const;

    const sizeClasses =
      variant === "icon" ? `p-0 ${sizeMap[size].sq}` : sizeMap[size].pad;

    const IconNode =
      typeof icon === "string"
        ? (() => {
            const I = icons[icon as IconKey];
            return I ? <I className={sizeMap[size].icon} /> : null;
          })()
        : (icon as React.ReactNode | null);

    const content =
      iconPosition === "only" ? (
        IconNode
      ) : iconPosition === "right" ? (
        <>
          {children}
          {IconNode}
        </>
      ) : (
        <>
          {IconNode}
          {children}
        </>
      );

    const onlyIconCompact =
      iconPosition === "only" && variant !== "icon"
        ? `${sizeMap[size].sq} p-0`
        : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizeClasses,
          onlyIconCompact,
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
