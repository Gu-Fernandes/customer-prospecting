"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { getProducts, Product } from "@/services/products.service";

const POLL_INTERVAL = 60_000;

export function useProducts() {
  const isBrowser = typeof window !== "undefined";

  const [loading, setLoading] = useState<boolean>(() => {
    if (!isBrowser) return true;
    return isAuthenticated();
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar produtos.");
    }
  }

  useEffect(() => {
    if (!isBrowser) return;

    const hasToken = isAuthenticated();
    if (!hasToken) return;

    let alive = true;

    (async () => {
      await fetchAll();
      if (alive) setLoading(false);
    })();

    const interval = setInterval(fetchAll, POLL_INTERVAL);

    const onVis = () => {
      if (document.visibilityState === "visible") fetchAll();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [isBrowser]);

  return { loading, products, error, reload: fetchAll };
}
