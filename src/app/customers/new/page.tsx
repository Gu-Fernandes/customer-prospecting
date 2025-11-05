"use client";

import { useEffect, useState } from "react";
import { CustomerFormCard } from "@/app/components/customer/customer-form-card";
import { Loading } from "@/components/loading/loading";

export default function RegistrationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      {!mounted ? <Loading fullScreen={false} /> : <CustomerFormCard />}
    </main>
  );
}
