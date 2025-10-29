import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospecção clientes",
  description: "Sistema para prospecção de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
