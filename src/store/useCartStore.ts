import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  image?: string;
  stockQuantity?: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  isAuthenticated: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithDatabase: () => Promise<void>;
  loadCartFromDatabase: () => Promise<void>;
  setAuthenticated: (authenticated: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,
      isAuthenticated: false,
      
      addItem: async (item) => {
        const state = get();
        
        // Optimistically update local state
        const existingItem = state.items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          set({
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({
            items: [...state.items, { ...item, id: crypto.randomUUID() }]
          });
        }
        
        // If authenticated, sync with database
        if (state.isAuthenticated) {
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
              }),
            });
            
            if (!response.ok) {
              // Revert on error
              set({ items: state.items });
              throw new Error('Failed to add item to cart');
            }
          } catch (error) {
            console.error('Error syncing cart:', error);
            // Keep local state on error
          }
        }
      },
      
      removeItem: async (itemId) => {
        const state = get();
        const item = state.items.find(i => i.id === itemId);
        
        // Optimistically update
        set({
          items: state.items.filter(i => i.id !== itemId)
        });
        
        // If authenticated, sync with database
        if (state.isAuthenticated && item) {
          try {
            const response = await fetch(`/api/cart?id=${itemId}`, {
              method: 'DELETE',
            });
            
            if (!response.ok) {
              // Revert on error
              set({ items: state.items });
              throw new Error('Failed to remove item from cart');
            }
          } catch (error) {
            console.error('Error removing item:', error);
          }
        }
      },
      
      updateQuantity: async (itemId, quantity) => {
        const state = get();
        
        // Optimistically update
        set({
          items: quantity <= 0
            ? state.items.filter(i => i.id !== itemId)
            : state.items.map(i =>
                i.id === itemId ? { ...i, quantity } : i
              )
        });
        
        // If authenticated, sync with database
        if (state.isAuthenticated) {
          try {
            const response = await fetch('/api/cart', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartItemId: itemId,
                quantity,
              }),
            });
            
            if (!response.ok) {
              // Revert on error
              set({ items: state.items });
              throw new Error('Failed to update cart');
            }
          } catch (error) {
            console.error('Error updating cart:', error);
          }
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const price = item.salePrice ?? item.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      syncWithDatabase: async () => {
        const state = get();
        
        if (!state.isAuthenticated || state.isSyncing) return;
        
        set({ isSyncing: true });
        
        try {
          // Send local cart to sync endpoint
          const localCart = state.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          }));
          
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ localCart }),
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Update local cart with synced data
            if (data.cart) {
              set({
                items: data.cart.items.map((item: any) => ({
                  id: item.id,
                  productId: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  salePrice: item.product.salePrice,
                  quantity: item.quantity,
                  image: item.product.images?.[0],
                  stockQuantity: item.product.stockQuantity,
                })),
              });
            }
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      
      loadCartFromDatabase: async () => {
        const state = get();
        
        if (!state.isAuthenticated || state.isLoading) return;
        
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/cart');
          
          if (response.ok) {
            const data = await response.json();
            
            // Replace local cart with database cart
            set({
              items: data.items.map((item: any) => ({
                id: item.id,
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                salePrice: item.product.salePrice,
                quantity: item.quantity,
                image: item.product.images?.[0],
                stockQuantity: item.product.stockQuantity,
              })),
            });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
        
        if (authenticated) {
          // When user signs in, sync local cart with database
          get().syncWithDatabase();
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);