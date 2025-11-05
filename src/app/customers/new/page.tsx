"use client";

import { CustomerFormCard } from "@/app/components/customer/customer-form-card";
import { Loading } from "@/components/loading/loading";

export default function RegistrationPage() {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Loading label="Carregando..." />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <CustomerFormCard />
    </main>
  );
}
