import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell/app-shell";

export const metadata: Metadata = {
  title: "Prospecção clientes",
  description: "Sistema para prospecção de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
