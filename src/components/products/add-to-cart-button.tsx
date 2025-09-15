"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    salePrice?: string | number | null;
    image?: string;
    stockQuantity: number;
  };
  disabled?: boolean;
  variant?: "default" | "icon";
  className?: string;
}

export default function AddToCartButton({ 
  product, 
  disabled = false,
  variant = "default",
  className = ""
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Check if item already in cart
      const existingItem = items.find(item => item.productId === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newTotalQuantity = currentQuantity + quantity;

      // Check stock
      if (newTotalQuantity > product.stockQuantity) {
        toast({
          title: "Stock limit reached",
          description: `Only ${product.stockQuantity - currentQuantity} more available.`,
          variant: "destructive",
        });
        setIsAdding(false);
        return;
      }

      // Add to cart
      const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
      const salePrice = product.salePrice ? 
        (typeof product.salePrice === "string" ? parseFloat(product.salePrice) : product.salePrice) : 
        null;
      
      await addItem({
        productId: product.id,
        name: product.name,
        price: price,
        salePrice: salePrice,
        image: product.image || "",
        quantity: quantity,
        stockQuantity: product.stockQuantity,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      });

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        size="icon"
        className={className}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={() => handleQuantityChange("decrease")}
            disabled={quantity <= 1 || disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 min-w-[60px] text-center font-medium">
            {quantity}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={() => handleQuantityChange("increase")}
            disabled={quantity >= product.stockQuantity || disabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={disabled || isAdding}
          size="lg"
          className={`flex-1 ${className}`}
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      
      {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
        <p className="text-sm text-orange-500 text-center">
          Hurry! Only {product.stockQuantity} left in stock
        </p>
      )}
    </div>
  );
}