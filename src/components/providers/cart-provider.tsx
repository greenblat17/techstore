"use client";

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useCartStore } from '@/store/useCartStore';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { setAuthenticated, syncWithDatabase, loadCartFromDatabase } = useCartStore();

  useEffect(() => {
    if (!isLoaded) return;

    // Update authentication state in cart store
    setAuthenticated(!!isSignedIn);

    if (isSignedIn) {
      // When user signs in, sync local cart with database
      syncWithDatabase().then(() => {
        // After syncing, load the latest cart from database
        loadCartFromDatabase();
      });
    }
  }, [isSignedIn, isLoaded, setAuthenticated, syncWithDatabase, loadCartFromDatabase]);

  return <>{children}</>;
}