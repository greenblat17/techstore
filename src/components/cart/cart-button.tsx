"use client";

import { useEffect, useState } from "react";
import { CartDrawer } from "./cart-drawer";

export function CartButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the cart drawer after mounting to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return <CartDrawer />;
}