"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { ProductFormCard } from "../components/product-form-card";

export default function NewProductPage() {
  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar produtos.">
      <div className="grid min-h-full place-items-center">
        <div className="w-full max-w-md sm:max-w-lg">
          <ProductFormCard />
        </div>
      </div>
    </AuthGuard>
  );
}
