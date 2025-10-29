"use client";

import { cn } from "@/libs/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className, disabled, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      rounded-lg px-4 py-2 text-sm font-medium shadow-sm outline-none
      transition-colors 
      disabled:cursor-not-allowed disabled:opacity-50
    `;

    const variants: Record<ButtonVariant, string> = {
      default: `
        bg-primary text-white
        hover:bg-primary/80 
        border border-primary
      `,

      destructive: `
        bg-red-600 text-white
        hover:bg-red-500
        focus:ring-red-500
      `,

      outline: `
        bg-transparent text-foreground
        border-primary border  
        hover:bg-primary hover:text-white
      `,

      ghost: `
        bg-transparent text-foreground
        hover:bg-zinc-200/50
      `,

      icon: `
        bg-transparent text-foreground
        border border-transparent
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        p-0 h-9 w-9
      `,
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
