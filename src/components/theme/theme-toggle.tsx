"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/libs/cn";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // evita chamada síncrona de setState
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted px-1">
        <span className="absolute left-1 h-7 w-7 rounded-full bg-background shadow" />
      </div>
    );
  }

  const currentTheme = (theme === "system" ? systemTheme : theme) ?? "light";
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Alternar tema"
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted px-1 transition-colors hover:bg-muted/80"
    >
      <Sun
        className={cn(
          "absolute left-2 h-4 w-4 transition-colors",
          !isDark ? "text-yellow-500" : "text-muted-foreground/40"
        )}
      />
      <Moon
        className={cn(
          "absolute right-2 h-4 w-4 transition-colors",
          isDark ? "text-indigo-300" : "text-muted-foreground/40"
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute h-7 w-7 rounded-full bg-background shadow-md transition-transform duration-300 ease-in-out",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
      />
    </button>
  );
}
