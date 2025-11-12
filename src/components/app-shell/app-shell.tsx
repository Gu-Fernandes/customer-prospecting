import { Footer } from "../footer/footer";
import { Header } from "../header/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto h-full min-h-full max-w-6xl px-4 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
