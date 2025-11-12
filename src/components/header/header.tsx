import Link from "next/link";

export function Header() {
  return (
    <header className="h-16 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg text-primary font-semibold">
          Prospecção Clientes
        </Link>
      </div>
    </header>
  );
}
