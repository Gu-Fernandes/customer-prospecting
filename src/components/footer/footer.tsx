import Link from "next/link";

const BRAND = "Prospecção de clientes";
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "v1.0";
const LINKS = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos" },
] as const;
const CREDIT = {
  name: "Gustavo Fernandes",
  href: "https://devgustavofernandes.vercel.app/",
};

function LinksAndCredit() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      {LINKS.map((l, i) => (
        <span key={l.href} className="flex items-center">
          <Link
            href={l.href}
            className="hover:text-foreground transition-colors"
          >
            {l.label}
          </Link>
          {i < LINKS.length - 1 && <span className="mx-1 opacity-40">•</span>}
        </span>
      ))}
      {LINKS.length > 0 && <span className="opacity-40">•</span>}
      <span className="text-foreground/80">
        Desenvolvido por{" "}
        <a
          href={CREDIT.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 font-semibold hover:text-foreground hover:underline"
        >
          {CREDIT.name}
        </a>
      </span>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Rodapé"
      className="relative min-h-14 shrink-0 border-t border-border/50 bg-background/90 backdrop-blur-sm"
    >
      {/* hairline gradiente no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
        {/* MOBILE: duas linhas */}
        <div className="flex min-h-14 flex-col items-center justify-center gap-1 py-2 md:hidden">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-medium text-foreground">{BRAND}</span>
            <span className="opacity-40">•</span>
            <span>© {year}</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/80">
              {VERSION}
            </span>
          </div>
          <LinksAndCredit />
        </div>

        {/* DESKTOP: grid 3 colunas */}
        <div className="hidden h-14 grid-cols-[auto_1fr_auto] items-center gap-3 md:grid">
          <span className="truncate font-medium text-foreground">{BRAND}</span>

          <nav
            aria-label="Links do rodapé"
            className="flex items-center justify-center"
          >
            <LinksAndCredit />
          </nav>

          <div className="flex items-center justify-end gap-2">
            <span>© {year}</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/80">
              {VERSION}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
