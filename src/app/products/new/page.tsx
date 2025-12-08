"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth/auth-guard";
import { ProductFormCard } from "../components/product-form-card";

export default function NewProductPage() {
  const router = useRouter();

  function handleSuccess(code: string) {
    toast.success("Produto cadastrado com sucesso!", {
      description: code
        ? `O produto "${code}" foi adicionado à base.`
        : "O produto foi adicionado à base.",
    });

    router.push("/products");
  }

  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar produtos.">
      <div className="grid min-h-full place-items-center">
        <div className="w-full max-w-md sm:max-w-lg">
          <ProductFormCard onSuccess={handleSuccess} />
        </div>
      </div>
    </AuthGuard>
  );
}
